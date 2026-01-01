import { Injectable } from '@nestjs/common';
import { DatabaseHealthService } from '../database/database.health';

@Injectable()
export class HealthService {
  constructor(private readonly dbHealth: DatabaseHealthService) {}

  async check() {
    const db = await this.dbHealth.check();
    return {
      status: 'ok',
      database: db,
      timestamp: new Date().toISOString(),
    };
  }
}
