import { Test, TestingModule } from '@nestjs/testing';
import { CategoryRepositoryService } from './category-repository.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Category } from '../../Models/Category';

describe('CategoryDataAccessService', () => {
  let service: CategoryRepositoryService;
  let repository: Repository<Category>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryRepositoryService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CategoryRepositoryService>(CategoryRepositoryService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get category by id', async () => {
    const mockCategory = { id: 1, name: 'Electronics' } as Category;

    jest.spyOn(repository, 'findOne').mockResolvedValue(mockCategory);

    const result = await service.getCategory(1);
    expect(result).toEqual(mockCategory);
  });

  it('should return all categories', async () => {
    const mockCategories = [
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Books' },
    ] as Category[];

    jest.spyOn(repository, 'find').mockResolvedValue(mockCategories);
    const result = await service.getAllCategories();
    expect(result).toEqual(mockCategories);
  });

  it('should return categories based on search term', async () => {
    const mockCategories = [
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Books' },
    ] as Category[];

    jest.spyOn(repository, 'find').mockResolvedValue(mockCategories);

    const search = 'Electro';
    const result = await service.getAllCategoriesBySearch(search);
    expect(result).toEqual(mockCategories);
  });

  it('should create and return a new category', async () => {
    const categoryData = { name: 'Electronics', price: 100 } as Category;
    const savedCategory = { id: 1, ...categoryData } as Category;

    jest.spyOn(repository, 'create').mockReturnValue(categoryData);
    jest.spyOn(repository, 'save').mockResolvedValue(savedCategory);

    const result = await service.createCategory(categoryData);
    expect(result).toEqual(savedCategory);
    expect(repository.create).toHaveBeenCalledWith(categoryData);
    expect(repository.save).toHaveBeenCalledWith(categoryData);
  });

  it('should return false if an error occurs during creation', async () => {
    const categoryData = { name: 'Electronics', price: 100 } as Category;

    jest.spyOn(repository, 'create').mockReturnValue(categoryData);
    jest.spyOn(repository, 'save').mockRejectedValue(new Error('Some error'));

    const result = await service.createCategory(categoryData);
    expect(result).toBe(false);
  });

  it('should update and return the updated category', async () => {
    const categoryData = { name: 'Electronics', price: 150 } as Category;
    const categoryToUpdate = {
      id: 1,
      name: 'Old Name',
      price: 100,
    } as Category;
    const updatedCategory = {
      id: 1,
      ...categoryToUpdate,
      ...categoryData,
    } as Category;

    jest.spyOn(repository, 'findOne').mockResolvedValue(categoryToUpdate);
    jest.spyOn(repository, 'save').mockResolvedValue(updatedCategory);

    const result = await service.updateCategory(1, categoryData);
    expect(result).toEqual(updatedCategory);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(repository.save).toHaveBeenCalledWith({
      id: 1,
      ...categoryToUpdate,
      ...categoryData,
    });
  });

  it('should return false if the category to update is not found', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    const categoryData = { name: 'Electronics', price: 150 } as Category;
    const result = await service.updateCategory(999, categoryData);
    expect(result).toBe(false);
  });

  it('should return false if an error occurs during update', async () => {
    const categoryData = { name: 'Electronics', price: 150 } as Category;

    jest
      .spyOn(repository, 'findOne')
      .mockRejectedValue(new Error('Some error'));

    const result = await service.updateCategory(1, categoryData);
    expect(result).toBe(false);
  });

  it('should return true if the category is successfully deleted', async () => {
    const deleteResult = { affected: 1 } as DeleteResult;

    jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

    const result = await service.deleteCategory(1);
    expect(result).toBe(true);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it('should return false if no rows are affected', async () => {
    const deleteResult = { affected: 0 } as DeleteResult;

    jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

    const result = await service.deleteCategory(1);
    expect(result).toBe(false);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it('should return false if an error occurs', async () => {
    jest.spyOn(repository, 'delete').mockRejectedValue(new Error('Some error'));

    const result = await service.deleteCategory(1);
    expect(result).toBe(false);
  });
});
