import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto } from './dto/create-user-request';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('emails')
  async getEmails() {
    return await this.userService.getEmails();
  }

  @Post('register')
  async registerUser(@Body() body: CreateUserRequestDto) {
    return await this.userService.registerUser(body);
  }
}
