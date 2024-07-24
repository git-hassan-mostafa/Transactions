import { Injectable, NotImplementedException } from '@nestjs/common';
import { CategoryRepositoryService } from '../../Repository/category-repository/category-repository.service';
import { ResponseDTO } from '../../Helpers/DTO/ResponseDTO';
import { CategoryMessageEnum } from '../../Helpers/Enums/MessageEnum';
import { StatusEnum } from '../../Helpers/Enums/ResponseEnum';
import { ResponseService } from '../../helpers/services/response/response.service';
import { Category } from '../../Models/Category';

@Injectable()
export class CategoryService {
  constructor(
    private categoryDataAccess: CategoryRepositoryService,
    private responseService: ResponseService,
  ) {}
  async getCategory(id: number): Promise<ResponseDTO<Category>> {
    const category = await this.categoryDataAccess.getCategory(id);
    var response: ResponseDTO<Category>;
    if (category) {
      return (response = {
        Status: StatusEnum.success,
        Message: CategoryMessageEnum.success,
        RowsNumber: 1,
        Data: category,
      });
    }
    if (category === null) {
      return this.responseService.customFailureResponse<Category>(
        CategoryMessageEnum.NoDataFound,
      );
    }
    response = this.responseService.failureResponse<Category>();
    return response;
  }

  async getAllCategories(): Promise<ResponseDTO<Category>> {
    const allCategories = await this.categoryDataAccess.getAllCategories();
    var response: ResponseDTO<Category>;
    if (allCategories) {
      return (response = {
        Status: StatusEnum.success,
        Message: CategoryMessageEnum.success,
        RowsNumber: (allCategories as Category[]).length,
        Data: allCategories,
      });
    }
    if (allCategories === null) {
      return this.responseService.customFailureResponse<Category>(
        CategoryMessageEnum.NoDataFound,
      );
    }
    response = this.responseService.failureResponse<Category>();
    return response;
  }

  async getAllCategoriesBySearch(
    search: string,
  ): Promise<ResponseDTO<Category>> {
    const searchedcategories =
      await this.categoryDataAccess.getAllCategoriesBySearch(search);
    var response: ResponseDTO<Category>;
    if (searchedcategories) {
      return (response = {
        Status: StatusEnum.success,
        Message: CategoryMessageEnum.success,
        RowsNumber: (searchedcategories as Category[]).length,
        Data: searchedcategories,
      });
    }

    if (searchedcategories == null) {
      return this.responseService.customFailureResponse<Category>(
        CategoryMessageEnum.NoDataFound,
      );
    }
    response = this.responseService.failureResponse<Category>();
    return response;
  }

  async addCategory(category: Category): Promise<ResponseDTO<Category>> {
    var response: ResponseDTO<Category>;
    const categoryValidation = this.validateCategoryFields(category);
    if (categoryValidation) {
      return (response = {
        Status: StatusEnum.failed,
        Message: categoryValidation,
        RowsNumber: 0,
        Data: [],
      });
    }
    const newCategory = await this.categoryDataAccess.createCategory(category);
    if (newCategory) {
      return (response = {
        Status: StatusEnum.success,
        Message: CategoryMessageEnum.created,
        RowsNumber: 1,
        Data: newCategory,
      });
    }
    response = this.responseService.failureResponse<Category>();
    return response;
  }

  async updateCategory(
    id: number,
    category: Category,
  ): Promise<ResponseDTO<Category>> {
    const updatedCategory = await this.categoryDataAccess.updateCategory(
      id,
      category,
    );
    var response: ResponseDTO<Category>;
    if (updatedCategory) {
      return (response = {
        Status: StatusEnum.success,
        Message: CategoryMessageEnum.updated,
        RowsNumber: 1,
        Data: updatedCategory,
      });
    }
    response = this.responseService.failureResponse<Category>();
    return response;
  }

  async deleteCategory(id: number): Promise<ResponseDTO<Category>> {
    const isRowSuccessfullyDeleted =
      await this.categoryDataAccess.deleteCategory(id);
    var response: ResponseDTO<Category>;
    if (isRowSuccessfullyDeleted) {
      return (response = {
        RowsNumber: 0,
        Data: [],
        Message: CategoryMessageEnum.deleted,
        Status: StatusEnum.success,
      });
    }
    response = this.responseService.failureResponse<Category>();
    return response;
  }

  validateCategoryFields(category: Category): string {
    var nullProperty = null;
    const keys = Object.keys(category);
    if (!keys.length) return 'Some Fields Are Required';
    if (!keys.includes('name')) return 'category name is requried';
    if (!keys.includes('price')) return 'category price is requried';
    return nullProperty;
  }
}
