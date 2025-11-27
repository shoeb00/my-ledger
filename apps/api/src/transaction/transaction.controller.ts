import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import {
  TransactionListResponseDto,
  TransactionResponseDto,
} from './dto/transaction-response';
import { GetTransactionsRequestDto } from './dto/get-transaction-request';
import { CreateTransactionsRequestDto } from './dto/create-transaction-request';
import { Roles } from '../common/decorators/roles.decorator';
import { Roles as rolEnum } from '../permissions/enum/roles';
import { UpdateTransactionsRequestDto } from './dto/update-transaction-request';

@ApiTags('v1/transaction')
@Controller('v1/transaction')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Get('get/:id')
  @Roles(rolEnum.VIEWER)
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    type: TransactionResponseDto,
  })
  async get(@Param('id', ParseIntPipe) id: number) {
    return await this.service.get(id);
  }

  @Get('getAll')
  @Roles(rolEnum.VIEWER)
  @ApiOkResponse({
    type: TransactionResponseDto,
    isArray: true,
  })
  async getAll(@Query() query: GetTransactionsRequestDto) {
    return await this.service.getAll(query);
  }

  @Post('create')
  @Roles(rolEnum.EDITOR)
  @ApiOkResponse({
    type: TransactionListResponseDto,
  })
  async create(@Body() body: CreateTransactionsRequestDto) {
    return await this.service.create(body);
  }

  @Put('update')
  @Roles(rolEnum.EDITOR)
  @ApiOkResponse({
    type: TransactionResponseDto,
  })
  async update(@Query() query: UpdateTransactionsRequestDto) {
    return await this.service.update(query);
  }

  @Delete('delete/:id')
  @Roles(rolEnum.AUTHOR)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query('bookId', ParseIntPipe) _bookId: number,
  ) {
    return await this.service.delete(id);
  }
}
