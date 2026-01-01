import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DatabaseHealthService } from './database.health';

@Injectable()
export class DatabaseInitService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseInitService.name);
  constructor(private readonly dbHealthService: DatabaseHealthService) {}

  async onModuleInit() {
    const { status } = await this.dbHealthService.check();
    if (status === 'up') {
      this.logger.log('Database is up');
    } else {
      this.logger.error('Database is down');
      throw new Error('Database is not reachable');
    }
  }
}
