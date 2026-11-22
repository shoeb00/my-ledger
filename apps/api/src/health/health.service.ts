import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseHealthService } from '../database/database.health';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly dbHealth: DatabaseHealthService) {}

  async check() {
    const db = await this.dbHealth.check();
    return {
      status: 'ok',
      database: db,
      timestamp: new Date().toISOString(),
    };
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async keepAlive(): Promise<{ ok: boolean; timestamp: string }> {
    try {
      await this.dbHealth.check();
      this.logger.log('Postgres keep-alive succeeded');
      return { ok: true, timestamp: new Date().toISOString() };
    } catch (error) {
      this.logger.error('Postgres keep-alive failed', error);
      return { ok: false, timestamp: new Date().toISOString() };
    }
  }
}
