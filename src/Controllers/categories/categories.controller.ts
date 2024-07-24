import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ResponseDTO } from '../../Helpers/DTO/ResponseDTO';
import { ResponseService } from '../../helpers/services/response/response.service';
import { Category } from '../../Models/Category';
import { CategoryService } from '../../Services/category/category.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoryService: CategoryService) {}

  @Get('get/:id')
  async getCategory(@Param('id') id: number): Promise<ResponseDTO<Category>> {
    const category = await this.categoryService.getCategory(id);
    return category;
  }

  @Get()
  async read(): Promise<ResponseDTO<Category>> {
    const allCategories = await this.categoryService.getAllCategories();
    return allCategories;
  }

  @Get('searchcategories')
  async getCategoriesBySearch(
    @Query('search') search: string,
  ): Promise<ResponseDTO<Category>> {
    const allCategories =
      await this.categoryService.getAllCategoriesBySearch(search);
    return allCategories;
  }

  @Post()
  async create(@Body() category: Category): Promise<ResponseDTO<Category>> {
    const newCategory = await this.categoryService.addCategory(category);
    return newCategory;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() category: Category,
  ): Promise<ResponseDTO<Category>> {
    const updatedCategory = await this.categoryService.updateCategory(
      id,
      category,
    );
    return updatedCategory;
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<ResponseDTO<Category>> {
    const deleteResponse = await this.categoryService.deleteCategory(id);
    return deleteResponse;
  }
}
