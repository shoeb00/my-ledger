import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { createClerkClient } from '@clerk/backend';
import type { Request as ExpressReq } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC } from '../common/decorators/public.decorator';

interface AuthenticatedRequest extends ExpressReq {
  auth?: {
    clerkUserId: string;
  };
}

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  private readonly clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY!,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
  });

  private buildAbsoluteUrl(req: ExpressReq) {
    const host = req.get('host');
    const proto = (req.headers['x-forwarded-proto'] as string) ?? req.protocol;
    return `${proto}://${host}${req.originalUrl}`;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    try {
      const fullUrl = this.buildAbsoluteUrl(req);

      const fetchReq = new Request(fullUrl, {
        method: req.method,
        headers: req.headers as HeadersInit,
      });

      const result = await this.clerkClient.authenticateRequest(fetchReq);

      const toAuth =
        typeof result.toAuth === 'function' ? result.toAuth : undefined;
      const { isAuthenticated } = result;

      if (!isAuthenticated) throw new UnauthorizedException('Not signed in');

      const auth = (toAuth ? toAuth() : result) as {
        userId?: string;
        user?: { id: string };
      };
      const clerkUserId = auth?.userId ?? auth?.user?.id ?? undefined;
      if (!clerkUserId) throw new UnauthorizedException('Not signed in');

      req.auth = { clerkUserId };
      return true;
    } catch (err) {
      console.error('ClerkAuthGuard error', err);
      if (err instanceof UnauthorizedException) throw err;
      throw new InternalServerErrorException('Failed to authenticate');
    }
  }
}
