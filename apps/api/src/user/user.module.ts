import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from '../database/database.module';
import { PermissionsService } from '../permissions/permissions.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, PermissionsService],
  exports: [UserService],
})
export class UserModule {}
