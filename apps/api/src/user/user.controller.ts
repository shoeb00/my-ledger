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

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get/:id')
  async getUser(@Param('id') id: number) {
    return await this.userService.getUser(id);
  }

  @Post('register')
  async registerUser(@Body() body: CreateUserRequestDto) {
    return await this.userService.registerUser(body);
  }

  @Post('invite')
  async inviteUser(@Body() body: InviteUserRequestDto) {
    return await this.userService.inviteUser(body);
  }

  @Delete('cancelInvite/:id')
  async cancelInvite(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.cancelInvite(id);
  }
}
