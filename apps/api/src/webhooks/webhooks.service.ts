import { Injectable, BadRequestException } from '@nestjs/common';
import { Webhook } from 'svix';
import { UserService } from '../user/user.service';

interface ClerkEvent {
  type: string;
  data: {
    first_name: string;
    last_name: string;
    email_addresses: Array<{ email_address: string }>;
  };
}

@Injectable()
export class WebhooksService {
  constructor(private readonly userService: UserService) {}

  private getHeader(
    headers: Record<string, string | string[] | undefined>,
    name: string,
  ): string {
    const val = headers[name];
    if (!val) {
      throw new BadRequestException(`Missing required header ${name}`);
    }
    return Array.isArray(val) ? val[0] || '' : val;
  }

  async handleWebhook(
    headers: Record<string, string | string[] | undefined>,
    rawBody: Buffer | undefined,
  ) {
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      throw new Error('Webhook secret not configured');
    }
    if (!rawBody) {
      throw new BadRequestException('Missing raw body');
    }

    const svixHeaders: Record<string, string> = {
      'svix-id': this.getHeader(headers, 'svix-id'),
      'svix-timestamp': this.getHeader(headers, 'svix-timestamp'),
      'svix-signature': this.getHeader(headers, 'svix-signature'),
    };

    const webhook = new Webhook(secret);

    let event: ClerkEvent;
    try {
      event = webhook.verify(rawBody, svixHeaders) as ClerkEvent;
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Webhook signature verification failed');
    }

    if (event?.type === 'user.created') {
      const user = event.data as {
        first_name: string;
        last_name: string;
        email_addresses: [{ email_address: string }];
        id: string;
      };
      const email = user?.email_addresses[0]?.email_address;
      const existingUser = await this.userService.getUser({ email });
      if (existingUser) {
        return { ok: true };
      }
      const name = `${user.first_name} ${user.last_name}`.trim();
      await this.userService.registerUser({
        email,
        name,
        clerkUserId: user.id,
      });
    }

    return { ok: true };
  }
}
