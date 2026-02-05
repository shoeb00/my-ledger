import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto } from './dto/create-user-request';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getRegisteredUser')
  async getRegisteredUser(@Query('clerkUserId') clerkUserId: string) {
    return await this.userService.getUser({ clerkUserId });
  }

  @Get('emails')
  async getEmails() {
    return await this.userService.getEmails();
  }

  @Post('register')
  async registerUser(@Body() body: CreateUserRequestDto) {
    return await this.userService.registerUser(body);
  }
}
