import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Category } from '../../Models/Category';

@Injectable()
export class CategoryRepositoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getCategory(id: number): Promise<Category | boolean> {
    try {
      const category = await this.categoryRepository.findOne({
        where: {
          id,
        },
      });
      return category;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  async getAllCategories(): Promise<Category[] | boolean> {
    try {
      const allCategories = await this.categoryRepository.find();
      return allCategories;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  async getAllCategoriesBySearch(
    search: string,
  ): Promise<Category[] | boolean> {
    try {
      const filteredCategories = await this.categoryRepository.find({
        where: {
          name: ILike(`%${search || ''}%`),
        },
      });
      return filteredCategories;
    } catch (error) {
      console.error('the error is here ' + error.message);
      return false;
    }
  }

  async createCategory(category: Category): Promise<Category | boolean> {
    try {
      const newCategory = this.categoryRepository.create(category);
      const createdCategory = await this.categoryRepository.save(newCategory);
      return createdCategory;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  async updateCategory(
    id: number,
    category: Category,
  ): Promise<Category | boolean> {
    try {
      const categoryToUpdate = await this.categoryRepository.findOne({
        where: { id },
      });
      const updatedCategory = await this.categoryRepository.save({
        id,
        ...categoryToUpdate,
        ...category,
      });
      return updatedCategory;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  async deleteCategory(id: number): Promise<boolean> {
    try {
      const deletedCategory = await this.categoryRepository.delete(id);
      const nbRowsAffected = deletedCategory.affected;
      return nbRowsAffected > 0;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
