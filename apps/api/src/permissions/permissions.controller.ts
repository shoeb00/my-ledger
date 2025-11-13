import { PermissionsResponse } from './dto/permissions-response';
import { SavePermissionsRequestDto } from './dto/create-or-update-permissions-request';
import { PermissionsService } from './permissions.service';
import { Body, Controller, Put } from '@nestjs/common';

@Controller('v1/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Put('update')
  async updatePermissions(
    @Body() body: SavePermissionsRequestDto,
  ): Promise<PermissionsResponse> {
    return await this.permissionsService.updatePermissions(body);
  }
}
