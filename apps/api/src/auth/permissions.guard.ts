import { RequestContextService } from './../common/request-context.service';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserService } from '../user/user.service';
import { ROLE_RANK } from '../permissions/enum/roles';
import { Request } from 'express';
import { PermissionsService } from '../permissions/permissions.service';
import { UserResponseDto } from '../user/dto/user-response';
import { PermissionsResponse } from '../permissions/dto/permissions-response';

type ReqBody = { bookId?: string } & Record<string, unknown>;
type ReqQuery = { bookId?: string } & Record<
  string,
  string | string[] | undefined
>;

interface RequestWithAuth extends Request<any, any, ReqBody, ReqQuery> {
  auth?: { clerkUserId?: string };
  user?: UserResponseDto;
  permissions?: PermissionsResponse;
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UserService,
    private permissionsService: PermissionsService,
    private requestContextService: RequestContextService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const req = context.switchToHttp().getRequest<RequestWithAuth>();
    const clerkUserId = req.auth?.clerkUserId;
    if (!clerkUserId) {
      throw new ForbiddenException(
        'No authenticated user available for authorization',
      );
    }

    const user = await this.usersService.getUser({
      clerkUserId,
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    this.requestContextService.setUser(user);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const rawBookId = req.query?.bookId || req.body?.bookId;
    const bookId = parseInt(String(rawBookId), 10);
    if (Number.isNaN(bookId)) throw new ForbiddenException('Invalid bookId');
    if (!bookId) throw new ForbiddenException('No bookId provided');

    const permissions = await this.permissionsService.getPermissions({
      userId: user.id,
      bookId,
    });

    if (!permissions) throw new ForbiddenException('Role not found');
    const userRank = ROLE_RANK[permissions.role] ?? 0;
    const requiredMinRank = Math.min(
      ...requiredRoles.map(
        (r) =>
          ROLE_RANK[r as keyof typeof ROLE_RANK] ?? Number.POSITIVE_INFINITY,
      ),
    );

    if (userRank < requiredMinRank) {
      throw new ForbiddenException('Insufficient role');
    }

    this.requestContextService.setPermissions(permissions);
    return true;
  }
}
