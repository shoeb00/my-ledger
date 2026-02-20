import {
  Body,
  Controller,
  Post,
  Delete,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryRequestDto } from './dto/category-request';
import { CategoryResponseDto } from './dto/category-response';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('v1/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('get')
  @ApiOperation({ summary: 'Get all categories for a book' })
  @ApiQuery({ name: 'bookId', type: Number })
  async getCategories(
    @Query('bookId', ParseIntPipe) bookId: number,
  ): Promise<CategoryResponseDto[]> {
    return await this.categoryService.getCategories(bookId);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new category' })
  async createCategory(
    @Body() body: CreateCategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    return await this.categoryService.createCategory(body);
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiQuery({ name: 'id', type: Number })
  async deleteCategory(@Query('id', ParseIntPipe) id: number): Promise<void> {
    return await this.categoryService.deleteCategory(id);
  }
}
