import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { Category } from '../../Models/Category';
import { CategoryRepositoryService } from '../../Repository/category-repository/category-repository.service';
import { CategoryMessageEnum } from '../../Helpers/Enums/MessageEnum';
import { StatusEnum } from '../../Helpers/Enums/ResponseEnum';
import { ResponseService } from '../../helpers/services/response/response.service';
import { ResponseDTO } from '../../Helpers/DTO/ResponseDTO';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let categoryRepository: CategoryRepositoryService;
  let responseService: ResponseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepositoryService,
          useValue: {
            getCategory: jest.fn(),
            getAllCategories: jest.fn(),
            getAllCategoriesBySearch: jest.fn(),
            createCategory: jest.fn(),
            updateCategory: jest.fn(),
            deleteCategory: jest.fn(),
          },
        },
        {
          provide: ResponseService,
          useValue: {
            failureResponse: jest.fn().mockReturnValue({
              Status: StatusEnum.failed,
              Message: CategoryMessageEnum.failure,
              RowsNumber: 0,
              Data: [],
            }),
            customFailureResponse: jest.fn(),
          },
        },
      ],
    }).compile();

    categoryService = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<CategoryRepositoryService>(
      CategoryRepositoryService,
    );
    responseService = module.get<ResponseService>(ResponseService);
  });

  it('should be defined', () => {
    expect(categoryService).toBeDefined();
  });

  it('should return category by id', async () => {
    const category: Category = {
      id: 1,
      name: 'category',
      quantity: 10,
      price: 10,
    };
    const response = {
      Status: StatusEnum.success,
      Message: CategoryMessageEnum.success,
      RowsNumber: 1,
      Data: category,
    };
    jest.spyOn(categoryRepository, 'getCategory').mockResolvedValue(category);
    const result = await categoryService.getCategory(1);
    expect(result).toEqual(response);
  });

  it('should return failure response if category data access getCategory returns false', async () => {
    jest.spyOn(categoryRepository, 'getCategory').mockResolvedValue(false);
    const result = await categoryService.getCategory(1);
    expect(responseService.failureResponse).toHaveBeenCalled();
    expect(result).toEqual(responseService.failureResponse());
  });

  it('should return failure response if no category found for this id', async () => {
    jest.spyOn(categoryRepository, 'getCategory').mockResolvedValue(null);
    const result = await categoryService.getCategory(1);
    expect(responseService.customFailureResponse).toHaveBeenCalledWith(
      CategoryMessageEnum.NoDataFound,
    );
    expect(result).toEqual(
      responseService.customFailureResponse<Category>(
        CategoryMessageEnum.NoDataFound,
      ),
    );
  });

  it('should return failure response if get category from repository return false', async () => {
    jest.spyOn(categoryRepository, 'getCategory').mockResolvedValue(false);
    const result = await categoryService.getCategory(1);
    expect(responseService.failureResponse).toHaveBeenCalled();
    expect(result).toEqual(responseService.failureResponse());
  });

  it('should return all categories', async () => {
    const allCategories: Category[] = [
      { id: 1, name: 'category1', price: 10 },
      { id: 2, name: 'category2', price: 20 },
    ];
    const response: ResponseDTO<Category> = {
      Status: StatusEnum.success,
      Message: CategoryMessageEnum.success,
      RowsNumber: allCategories.length,
      Data: allCategories,
    };
    jest
      .spyOn(categoryRepository, 'getAllCategories')
      .mockResolvedValue(allCategories);
    const result = await categoryService.getAllCategories();
    expect(result).toEqual(response);
  });

  it('should return failure response if no category found', async () => {
    jest.spyOn(categoryRepository, 'getAllCategories').mockResolvedValue(null);
    const result = await categoryService.getAllCategories();
    expect(responseService.customFailureResponse).toHaveBeenCalledWith(
      CategoryMessageEnum.NoDataFound,
    );
    expect(result).toEqual(
      responseService.customFailureResponse<Category>(
        CategoryMessageEnum.NoDataFound,
      ),
    );
  });

  it('should return failure response if get all categories from repository return false', async () => {
    jest.spyOn(categoryRepository, 'getAllCategories').mockResolvedValue(false);
    const result = await categoryService.getAllCategories();
    expect(responseService.failureResponse).toHaveBeenCalled();
    expect(result).toEqual(responseService.failureResponse());
  });

  it('should return failure response if category data access get all categories returns false', async () => {
    jest.spyOn(categoryRepository, 'getAllCategories').mockResolvedValue(false);
    const result = await categoryService.getAllCategories();
    expect(responseService.failureResponse).toHaveBeenCalled();
    expect(result).toEqual(responseService.failureResponse());
  });

  it('should return all categories matching the search term', async () => {
    const allCategoriesBySearch: Category[] = [
      { id: 1, name: 'category1', price: 10 },
      { id: 2, name: 'category2', price: 20 },
    ];
    const response: ResponseDTO<Category> = {
      Status: StatusEnum.success,
      Message: CategoryMessageEnum.success,
      RowsNumber: allCategoriesBySearch.length,
      Data: allCategoriesBySearch,
    };
    jest
      .spyOn(categoryRepository, 'getAllCategoriesBySearch')
      .mockResolvedValue(allCategoriesBySearch);
    const result = await categoryService.getAllCategoriesBySearch('cat');
    expect(result).toEqual(response);
  });

  it('should return failure response if no category found by search', async () => {
    jest
      .spyOn(categoryRepository, 'getAllCategoriesBySearch')
      .mockResolvedValue(null);
    const result = await categoryService.getAllCategoriesBySearch('cat');
    expect(responseService.customFailureResponse).toHaveBeenCalledWith(
      CategoryMessageEnum.NoDataFound,
    );
    expect(result).toEqual(
      responseService.customFailureResponse<Category>(
        CategoryMessageEnum.NoDataFound,
      ),
    );
  });

  it('should return failure response if category data access get all categories returns false', async () => {
    jest
      .spyOn(categoryRepository, 'getAllCategoriesBySearch')
      .mockResolvedValue(false);
    const result = await categoryService.getAllCategoriesBySearch('cat');
    expect(responseService.failureResponse).toHaveBeenCalled();
    expect(result).toEqual(responseService.failureResponse());
  });

  it('should add a category successfully', async () => {
    const category: Category = {
      id: 1,
      name: 'category',
      price: 10,
    };
    jest.spyOn(categoryService, 'validateCategoryFields').mockReturnValue(null);
    jest
      .spyOn(categoryRepository, 'createCategory')
      .mockResolvedValue(category);

    const result = await categoryService.addCategory(category);
    const response: ResponseDTO<Category> = {
      Status: StatusEnum.success,
      Message: CategoryMessageEnum.created,
      RowsNumber: 1,
      Data: category,
    };
    expect(result).toEqual(response);
  });

  it('should fail to add a category with "Some Fields Are Required"', async () => {
    const category: Category = {} as Category;
    var validationMessage = 'Some Fields Are Required';
    jest
      .spyOn(categoryService, 'validateCategoryFields')
      .mockReturnValue(validationMessage);

    const result = await categoryService.addCategory(category);
    const response: ResponseDTO<Category> = {
      Status: StatusEnum.failed,
      Message: validationMessage,
      RowsNumber: 0,
      Data: [],
    };
    expect(result).toEqual(response);
  });

  it('should fail to add a category with "category name is requried"', async () => {
    const category: Category = {} as Category;
    var validationMessage = 'category name is requried';
    jest
      .spyOn(categoryService, 'validateCategoryFields')
      .mockReturnValue(validationMessage);

    const result = await categoryService.addCategory(category);
    const response: ResponseDTO<Category> = {
      Status: StatusEnum.failed,
      Message: validationMessage,
      RowsNumber: 0,
      Data: [],
    };
    expect(result).toEqual(response);
  });

  it('should fail to add a category with "category price is requried"', async () => {
    const category: Category = {} as Category;
    var validationMessage = 'category price is requried';
    jest
      .spyOn(categoryService, 'validateCategoryFields')
      .mockReturnValue(validationMessage);

    const result = await categoryService.addCategory(category);
    const response: ResponseDTO<Category> = {
      Status: StatusEnum.failed,
      Message: validationMessage,
      RowsNumber: 0,
      Data: [],
    };
    expect(result).toEqual(response);
  });

  it('should fail to add if category data access add category return null', async () => {
    const category: Category = {} as Category;
    jest.spyOn(categoryService, 'validateCategoryFields').mockReturnValue(null);
    jest.spyOn(categoryRepository, 'createCategory').mockReturnValue(null);

    const result = await categoryService.addCategory(category);
    expect(responseService.failureResponse).toHaveBeenCalled();
    expect(result).toEqual(responseService.failureResponse());
  });

  it('should fail to add if category data access add category return false', async () => {
    const category: Category = {} as Category;
    jest.spyOn(categoryService, 'validateCategoryFields').mockReturnValue(null);
    jest.spyOn(categoryRepository, 'createCategory').mockResolvedValue(false);

    const result = await categoryService.addCategory(category);
    expect(responseService.failureResponse).toHaveBeenCalled();
    expect(result).toEqual(responseService.failureResponse());
  });

  it('should update a category successfully', async () => {
    const id = 1;
    const categoryToUpdate: Category = {
      name: 'category1',
      price: 10,
    } as Category;

    const updatedCategory: Category = {
      id: 1,
      name: 'category2',
      price: 20,
    } as Category;
    jest
      .spyOn(categoryRepository, 'updateCategory')
      .mockResolvedValue(updatedCategory);

    const result = await categoryService.updateCategory(id, categoryToUpdate);
    const response: ResponseDTO<Category> = {
      Status: StatusEnum.success,
      Message: CategoryMessageEnum.updated,
      RowsNumber: 1,
      Data: updatedCategory,
    };
    expect(result).toEqual(response);
  });

  it('should fail to update a category if update category data access returns null', async () => {
    const category: Category = {} as Category;
    const id = 1;
    jest.spyOn(categoryRepository, 'updateCategory').mockResolvedValue(null);

    const result = await categoryService.updateCategory(id, category);
    expect(responseService.failureResponse).toHaveBeenCalled();
    expect(result).toEqual(responseService.failureResponse());
  });

  it('should fail to update a category if update category data access returns false', async () => {
    const category: Category = {} as Category;
    const id = 1;
    jest.spyOn(categoryRepository, 'updateCategory').mockResolvedValue(false);

    const result = await categoryService.updateCategory(id, category);
    expect(responseService.failureResponse).toHaveBeenCalled();
    expect(result).toEqual(responseService.failureResponse());
  });

  it('should delete a category successfully', async () => {
    const id = 1;
    jest.spyOn(categoryRepository, 'deleteCategory').mockResolvedValue(true);

    const result = await categoryService.deleteCategory(id);
    const response = {
      RowsNumber: 0,
      Data: [],
      Message: CategoryMessageEnum.deleted,
      Status: StatusEnum.success,
    };
    expect(result).toEqual(response);
  });

  it('should fail to delete a category if data access delete category returns false', async () => {
    const id = 1;
    jest.spyOn(categoryRepository, 'deleteCategory').mockResolvedValue(false);

    const result = await categoryService.deleteCategory(id);
    expect(responseService.failureResponse).toHaveBeenCalled();
    expect(result).toEqual(responseService.failureResponse());
  });

  it('should fail to delete a category if data access delete category returns null', async () => {
    const id = 1;
    jest.spyOn(categoryRepository, 'deleteCategory').mockResolvedValue(null);

    const result = await categoryService.deleteCategory(id);
    expect(responseService.failureResponse).toHaveBeenCalled();
    expect(result).toEqual(responseService.failureResponse());
  });

  it('should return "category name is required" if name is missing', () => {
    const category = { price: 100 };
    const result = categoryService.validateCategoryFields(category as Category);
    expect(result).toBe('category name is requried');
  });

  it('should return "category price is required" if price is missing', () => {
    const category = { name: 'Electronics' };
    const result = categoryService.validateCategoryFields(category as Category);
    expect(result).toBe('category price is requried');
  });

  it('should return null if both name and price are present', () => {
    const category = { name: 'Electronics', price: 100 };
    const result = categoryService.validateCategoryFields(category as Category);
    expect(result).toBeNull();
  });
});
