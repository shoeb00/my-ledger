import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { TransactionResponseDto } from './dto/transaction-response';
import { GetTransactionsRequestDto } from './dto/get-transaction-request';
import { CreateTransactionsRequestDto } from './dto/create-transaction-request';

@ApiTags('v1/transaction')
@Controller('v1/transaction')
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  @Get('get/:id')
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    type: TransactionResponseDto,
  })
  async get(@Param('id') id: number) {
    return await this.service.get(id);
  }

  @Get('getAll')
  @ApiOkResponse({
    type: TransactionResponseDto,
    isArray: true,
  })
  async getAll(@Query() query: GetTransactionsRequestDto) {
    return await this.service.getAll(query);
  }

  @Post('create')
  @ApiOkResponse({
    type: TransactionResponseDto,
  })
  async create(@Body() body: CreateTransactionsRequestDto) {
    return await this.service.create(body);
  }
}
