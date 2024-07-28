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
import { Category } from '../../Models/Category';
import { CategoryService } from '../../Services/category/category.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async Read(): Promise<ResponseDTO<Category>> {
    const allCategories = await this.categoryService.getAllCategories();
    return allCategories;
  }

  @Post()
  async Create(@Body() category: Category): Promise<ResponseDTO<Category>> {
    const newCategory = await this.categoryService.createCategory(category);
    return newCategory;
  }

  @Patch(':id')
  async Update(
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
  async Delete(@Param('id') id: number): Promise<ResponseDTO<Category>> {
    const deleteResponse = await this.categoryService.deleteCategory(id);
    return deleteResponse;
  }

  @Get('getCategory/:id')
  async getCategory(@Param('id') id: number): Promise<ResponseDTO<Category>> {
    const category = await this.categoryService.getCategory(id);
    return category;
  }

  @Get('searchcategories')
  async getCategoriesBySearch(
    @Query('search') search: string,
  ): Promise<ResponseDTO<Category>> {
    const allCategoriesBySearch =
      await this.categoryService.getAllCategoriesBySearch(search);
    return allCategoriesBySearch;
  }
}
