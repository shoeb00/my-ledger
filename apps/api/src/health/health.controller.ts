import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('/')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @Public()
  getHealth() {
    return this.healthService.check();
  }
}
