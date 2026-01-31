import { ClerkClient, createClerkClient } from '@clerk/backend';
import { Injectable } from '@nestjs/common';
import { CommonService } from '../common/common.service';

@Injectable()
export class ClerkService {
  private readonly client: ClerkClient;

  constructor(private readonly commonService: CommonService) {
    this.client = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY!,
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
    });
  }

  getClerkClient() {
    return this.client;
  }

  async inviteUser(emailAddress: string) {
    try {
      const invite = await this.client.invitations.createInvitation({
        emailAddress,
        redirectUrl: process.env.WEB_URL,
        expiresInDays: 30,
        ignoreExisting: true,
      });
      return invite;
    } catch (error) {
      const message = this.commonService.getErrorMessage(error);
      throw new Error(message);
    }
  }

  async revokeInvite(inviteId: string) {
    return await this.client.invitations.revokeInvitation(inviteId);
  }
}
