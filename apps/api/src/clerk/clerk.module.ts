import { Module } from '@nestjs/common';
import { ClerkService } from './clerk.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [ClerkService],
  exports: [ClerkService],
})
export class ClerkModule {}
