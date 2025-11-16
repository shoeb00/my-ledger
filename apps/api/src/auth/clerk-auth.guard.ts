import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { createClerkClient } from '@clerk/backend';
import type { Request as ExpressReq } from 'express';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY!,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
  });

  private buildAbsoluteUrl(req: ExpressReq) {
    // prefer originalUrl which includes query string
    const host = req.get('host');
    const proto = (req.headers['x-forwarded-proto'] as string) ?? req.protocol;
    return `${proto}://${host}${req.originalUrl}`;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<ExpressReq>();

    try {
      const fullUrl = this.buildAbsoluteUrl(req);

      // globalThis.Request exists on Node 18+
      const fetchReq = new globalThis.Request(fullUrl, {
        method: req.method,
        headers: req.headers as HeadersInit,
        // Clerk doesn't need body normally for session check; skip sending body for safety
      });

      const result = await (this.clerkClient as any).authenticateRequest(
        fetchReq,
        {
          authorizedParties: [
            process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000',
          ],
        },
      );

      // toAuth is sometimes provided by Clerk; handle both shapes
      const toAuth =
        typeof (result as any).toAuth === 'function'
          ? (result as any).toAuth
          : undefined;
      const { isAuthenticated } = result as any;

      if (!isAuthenticated) throw new UnauthorizedException('Not signed in');

      const auth = toAuth ? await toAuth() : (result as any);
      const clerkUserId = auth?.userId ?? auth?.user?.id ?? undefined;
      if (!clerkUserId) throw new UnauthorizedException('Not signed in');

      (req as any).auth = { clerkUserId };
      return true;
    } catch (err) {
      console.error('ClerkAuthGuard error', err);
      // distinguish auth failures vs internal errors if you want
      if (err instanceof UnauthorizedException) throw err;
      throw new InternalServerErrorException('Failed to authenticate');
    }
  }
}
