import { PermissionsResponse } from './dto/permissions-response';
import { SavePermissionsRequestDto } from './dto/create-or-update-permissions-request';
import { PermissionsService } from './permissions.service';
import { Body, Controller, Delete, Put, Query } from '@nestjs/common';
import { DeletePermissionRequestDto } from './dto/delete-permission-request';
import { Roles as rolEnum } from './enum/roles';
import { Roles } from '../auth/roles.decorator';

@Controller('v1/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Put('update')
  @Roles(rolEnum.AUTHOR)
  async updatePermissions(
    @Body() body: SavePermissionsRequestDto,
  ): Promise<PermissionsResponse> {
    return await this.permissionsService.updatePermissions(body);
  }

  @Delete('delete')
  @Roles(rolEnum.AUTHOR)
  async deletePermission(@Query() query: DeletePermissionRequestDto) {
    return await this.permissionsService.deletePermission(query);
  }
}
