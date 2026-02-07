import { Module } from '@nestjs/common';
import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';
import { PermissionsModule } from '../permissions/permissions.module';
import { ClerkModule } from '../clerk/clerk.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, PermissionsModule, ClerkModule],
  controllers: [InvitationsController],
  providers: [InvitationsService],
  exports: [InvitationsService],
})
export class InvitationsModule {}
