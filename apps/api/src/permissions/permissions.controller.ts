import { PermissionsResponse } from './dto/permissions-response';
import { SavePermissionsRequestDto } from './dto/create-or-update-permissions-request';
import { PermissionsService } from './permissions.service';
import { Body, Controller, Delete, Put, Query } from '@nestjs/common';
import { DeletePermissionRequestDto } from './dto/delete-permission-request';

@Controller('v1/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Put('update')
  async updatePermissions(
    @Body() body: SavePermissionsRequestDto,
  ): Promise<PermissionsResponse> {
    return await this.permissionsService.updatePermissions(body);
  }

  @Delete('delete')
  async deletePermission(@Query() query: DeletePermissionRequestDto) {
    return await this.permissionsService.deletePermission(query);
  }
}
