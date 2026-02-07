import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';
import { PermissionsService } from '../permissions/permissions.service';
import { ClerkService } from '../clerk/clerk.service';
import { InvitationsModule } from '../invitations/invitations.module';

@Module({
  imports: [DatabaseModule, InvitationsModule],
  controllers: [UserController],
  providers: [UserService, PermissionsService, ClerkService],
  exports: [UserService],
})
export class UserModule {}
