import {
  Body,
  Controller,
  Post,
  Delete,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { CreatePaymentMethodRequestDto } from './dto/payment-method-request';
import { PaymentMethodResponseDto } from './dto/payment-method-response';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('paymentMethods')
@Controller('v1/paymentMethod')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Get('get')
  @ApiOperation({ summary: 'Get all payment methods for a book' })
  @ApiQuery({ name: 'bookId', type: Number })
  async getPaymentMethods(
    @Query('bookId', ParseIntPipe) bookId: number,
  ): Promise<PaymentMethodResponseDto[]> {
    return await this.paymentMethodService.getPaymentMethods(bookId);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new payment method' })
  async createPaymentMethod(
    @Body() body: CreatePaymentMethodRequestDto,
  ): Promise<PaymentMethodResponseDto> {
    return await this.paymentMethodService.createPaymentMethod(body);
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete a payment method' })
  @ApiQuery({ name: 'id', type: Number })
  async deletePaymentMethod(
    @Query('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return await this.paymentMethodService.deletePaymentMethod(id);
  }
}
