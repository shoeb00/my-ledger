import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto } from './dto/create-user-request';
import { InviteUserRequestDto } from './dto/invite-user-request';
import { Roles } from '../common/decorators/roles.decorator';
import { Roles as rolesEnum } from '../permissions/enum/roles';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('invitations')
  async getInvitations() {
    return await this.userService.getInvitations();
  }

  @Get('emails')
  async getEmails() {
    return await this.userService.getEmails();
  }

  @Post('register')
  async registerUser(@Body() body: CreateUserRequestDto) {
    return await this.userService.registerUser(body);
  }

  @Roles(rolesEnum.EDITOR)
  @Post('invite')
  async inviteUser(@Body() body: InviteUserRequestDto) {
    return await this.userService.inviteUser(body);
  }

  @Delete('cancelInvite/:id')
  async cancelInvite(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.cancelInvite(id);
  }
}
