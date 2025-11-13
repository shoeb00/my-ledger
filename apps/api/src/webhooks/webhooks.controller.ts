import type { Request } from 'express';
import { Controller, Headers, Post, Req } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhookService: WebhooksService) {}

  @Post()
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ) {
    return this.webhookService.handleWebhook(headers, req.rawBody);
  }
}
