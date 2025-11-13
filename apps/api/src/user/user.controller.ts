import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto } from './dto/create-user-request';
import { InviteUserRequestDto } from './dto/invite-user-request';
import { GetUserRequestDto } from './dto/get-user-request';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get')
  async getUser(@Query() query: GetUserRequestDto) {
    return await this.userService.getUser(query);
  }

  @Get('invitations/:email')
  async getInvitations(@Param('email') email: string) {
    return await this.userService.getInvitations(email);
  }

  @Get('emails/:userId')
  async getEmails(@Param('userId') userId: number) {
    return await this.userService.getEmails(userId);
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
