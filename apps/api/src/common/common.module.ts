import { Global, Module } from '@nestjs/common';
import { RequestContextService } from './request-context.service';
import { CommonService } from './common.service';

@Global()
@Module({
  providers: [RequestContextService, CommonService],
  exports: [RequestContextService, CommonService],
})
export class CommonModule {}
