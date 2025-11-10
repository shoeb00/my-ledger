import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Post()
  async registerUser(@Body() body) {
    // return this.userService.registerUser(body);
  }
}
