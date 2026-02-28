import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { InviteUserRequestDto } from './dto/invite-user';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PermissionsService } from '../permissions/permissions.service';
import { RequestContextService } from '../common/request-context.service';
import { ClerkService } from '../clerk/clerk.service';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { invitations, inviteLinks } from './schema';
import { users } from '../user/schema';
import { Roles } from '../permissions/enum/roles';
import { PermissionsResponse } from '../permissions/dto/permissions-response';

const schema = { invitations, users, inviteLinks };

@Injectable()
export class InvitationsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly permissionsService: PermissionsService,
    private readonly cxt: RequestContextService,
    private readonly clerkService: ClerkService,
  ) {}
  async getInvitations(bookId: number) {
    const user = this.cxt.getUser();
    return await this.db.query.invitations.findMany({
      where: and(
        eq(schema.invitations.bookId, bookId),
        eq(schema.invitations.invitedBy, user.id),
        eq(schema.invitations.accepted, false),
      ),
    });
  }

  async inviteUnregisteredUser(body: InviteUserRequestDto) {
    const currentUser = this.cxt.getUser();
    const invite = await this.db.query.invitations.findFirst({
      where: and(
        eq(schema.invitations.email, body.email),
        eq(schema.invitations.invitedBy, currentUser.id),
        eq(schema.invitations.bookId, body.bookId),
      ),
    });
    if (invite) throw new BadRequestException('Already invited');
    const { id: clerkInviteId } = await this.clerkService.inviteUser(
      body.email,
    );
    const [invitation] = await this.db
      .insert(schema.invitations)
      .values({ ...body, invitedBy: currentUser.id, clerkInviteId })
      .returning();
    return invitation;
  }

  async inviteUser(
    body: InviteUserRequestDto,
  ): Promise<PermissionsResponse | string> {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.email, body.email),
    });
    if (!user) {
      await this.inviteUnregisteredUser(body);
      return 'Invitation sent';
    }
    const permission = await this.permissionsService.getPermissions({
      bookId: body.bookId,
      userId: user.id,
    });
    if (permission) return permission;
    const row = await this.permissionsService.createPermissions({
      bookId: body.bookId,
      role: body.role,
      userId: user.id,
    });
    return row;
  }

  async cancelInvite(id: number) {
    const user = this.cxt.getUser();
    const invite = await this.db.query.invitations.findFirst({
      where: and(eq(schema.invitations.id, id)),
    });
    if (!invite) throw new BadRequestException('Invite not found');
    if (invite.invitedBy !== user.id)
      throw new UnauthorizedException('Unauthorized');
    if (invite.accepted)
      throw new BadRequestException('Invite already accepted');
    await this.clerkService.revokeInvite(invite.clerkInviteId);
    await this.db
      .delete(schema.invitations)
      .where(eq(schema.invitations.id, id));
  }

  async acceptInvite(token: string): Promise<PermissionsResponse> {
    const invite = await this.db.query.inviteLinks.findFirst({
      where: eq(schema.inviteLinks.token, token),
    });
    if (!invite) throw new BadRequestException('Invalid invite link');
    if (new Date(invite.expiresAt).getTime() < Date.now())
      throw new Error('Invite link has expired');
    const alreadyAdded = await this.permissionsService.getPermissions({
      bookId: invite.bookId,
      userId: this.cxt.getUser().id,
    });
    if (alreadyAdded) throw new BadRequestException('Invite already accepted');
    const user = this.cxt.getUser();
    const result = await this.inviteUser({
      email: user.email,
      bookId: invite.bookId,
      role: Roles.VIEWER,
    });
    return result as PermissionsResponse;
  }

  async createInviteLink(bookId: number) {
    const existing = await this.db.query.inviteLinks.findFirst({
      where: eq(schema.inviteLinks.bookId, bookId),
    });
    const daysInMs = (days: number) => days * 24 * 60 * 60 * 1000;
    if (existing) {
      // TODO: Refine this logic
      const stillValid = new Date(existing.expiresAt).getTime() > daysInMs(15);
      if (stillValid) {
        return {
          ...existing,
          link: `${process.env.NEXT_PUBLIC_WEB_URL}/invite/${existing.token}`,
        };
      }
    }
    const token = crypto.randomUUID();
    const days = daysInMs(Number(process.env.INVITE_EXPIRATION_DAYS) || 30);
    const expiresAt = new Date(Date.now() + days);
    const [link] = await this.db
      .insert(schema.inviteLinks)
      .values({ bookId, token, expiresAt })
      .returning();
    if (!link) throw new BadRequestException('Failed to create invite link');
    const res = {
      ...link,
      link: `${process.env.NEXT_PUBLIC_WEB_URL}/invite/${token}`,
    };
    return res;
  }
}
