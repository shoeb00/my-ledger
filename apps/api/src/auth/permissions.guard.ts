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
import { UserResponseDto } from '../user/dto/user-response';
import { PermissionsResponse } from '../permissions/dto/permissions-response';
import { PermissionsService } from '../permissions/permissions.service';

interface RequestWithAuth extends Request {
  auth: {
    clerkUserId: string;
  };
  user: UserResponseDto;
  permissions: PermissionsResponse;
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UserService,
    private permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest() as RequestWithAuth;
    const clerkUserId = req.auth.clerkUserId as string;
    if (!clerkUserId) {
      throw new ForbiddenException(
        'No authenticated user available for authorization',
      );
    }

    const user = await this.usersService.getUser({
      clerkUserId,
    });
    const bookId = parseInt(req.query.bookId || req.body.bookId);
    if (!bookId) throw new ForbiddenException('No bookId provided');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

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

    req.user = user;
    req.permissions = permissions;
    return true;
  }
}
