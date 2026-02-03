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
import { invitations } from './schema';
import { users } from '../user/schema';

const schema = { invitations, users };

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

  async inviteUser(body: InviteUserRequestDto) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.email, body.email),
    });
    if (!user) return await this.inviteUnregisteredUser(body);
    const permission = await this.permissionsService.getPermissions({
      bookId: body.bookId,
      userId: user.id,
    });
    if (permission) throw new BadRequestException('User already has access');
    await this.permissionsService.createPermissions({
      bookId: body.bookId,
      role: body.role,
      userId: user.id,
    });
    return 'Success';
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
}
