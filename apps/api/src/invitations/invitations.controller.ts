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
import { InviteUserRequestDto } from './dto/invite-user';
import { Roles } from '../common/decorators/roles.decorator';
import { Roles as rolesEnum } from '../permissions/enum/roles';
import { InvitationsService } from './invitations.service';

@Controller('v1/invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Get('user')
  async getInvitations(@Query('bookId', ParseIntPipe) bookId: number) {
    return await this.invitationsService.getInvitations(bookId);
  }

  @Roles(rolesEnum.EDITOR)
  @Post('user')
  async inviteUser(@Body() body: InviteUserRequestDto) {
    return await this.invitationsService.inviteUser(body);
  }

  @Delete('revoke/:id')
  async cancelInvite(@Param('id', ParseIntPipe) id: number) {
    return await this.invitationsService.cancelInvite(id);
  }

  @Get('accept')
  async validateInviteToken(@Query('token') token: string) {
    return await this.invitationsService.acceptInvite(token);
  }

  @Roles(rolesEnum.AUTHOR)
  @Post('createLink')
  async createInviteLink(@Query('bookId', ParseIntPipe) bookId: number) {
    return await this.invitationsService.createInviteLink(bookId);
  }
}
