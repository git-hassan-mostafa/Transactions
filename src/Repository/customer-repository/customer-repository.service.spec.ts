import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CustomerRepositoryService } from './customer-repository.service';
import { Customer } from '../../Models/Customer';

describe('CustomerRepositoryService', () => {
  let service: CustomerRepositoryService;
  let repository: Repository<Customer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerRepositoryService,
        {
          provide: getRepositoryToken(Customer),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CustomerRepositoryService>(CustomerRepositoryService);
    repository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCustomers', () => {
    it('should return an array of customers', async () => {
      const customers: Customer[] = [new Customer(), new Customer()];
      jest.spyOn(repository, 'find').mockResolvedValue(customers);

      expect(await service.getAllCustomers()).toBe(customers);
    });

    it('should return false if an error occurs', async () => {
      jest.spyOn(repository, 'find').mockRejectedValue(new Error('Some error'));

      expect(await service.getAllCustomers()).toBe(false);
    });
  });

  describe('getCustomer', () => {
    it('should return a customer by id', async () => {
      const customer = new Customer();
      jest.spyOn(repository, 'findOne').mockResolvedValue(customer);

      expect(await service.getCustomer(1)).toBe(customer);
    });

    it('should return false if an error occurs', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockRejectedValue(new Error('Some error'));

      expect(await service.getCustomer(1)).toBe(false);
    });
  });

  describe('getAllCustomersBySearch', () => {
    it('should return filtered customers', async () => {
      const customers: Customer[] = [new Customer(), new Customer()];
      jest.spyOn(repository, 'find').mockResolvedValue(customers);

      expect(await service.getAllCustomersBySearch('search')).toBe(customers);
    });

    it('should return false if an error occurs', async () => {
      jest.spyOn(repository, 'find').mockRejectedValue(new Error('Some error'));

      expect(await service.getAllCustomersBySearch('search')).toBe(false);
    });
  });

  describe('createCustomer', () => {
    it('should create a new customer', async () => {
      const customer = new Customer();
      jest.spyOn(repository, 'create').mockReturnValue(customer);
      jest.spyOn(repository, 'save').mockResolvedValue(customer);

      expect(await service.createCustomer(customer)).toBe(customer);
    });

    it('should return false if an error occurs', async () => {
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Some error'));

      expect(await service.createCustomer(new Customer())).toBe(false);
    });
  });

  describe('updateCustomer', () => {
    it('should update an existing customer', async () => {
      const customer = new Customer();
      jest.spyOn(repository, 'findOne').mockResolvedValue(customer);
      jest.spyOn(repository, 'save').mockResolvedValue(customer);

      expect(await service.updateCustomer(1, customer)).toBe(customer);
    });

    it('should return false if an error occurs', async () => {
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Some error'));

      expect(await service.updateCustomer(1, new Customer())).toBe(false);
    });
  });

  describe('delete Customer', () => {
    it('should delete a customer by id', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1 } as DeleteResult);

      expect(await service.deleteCustomer(1)).toBe(true);
    });

    it('should return false if an error occurs', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockRejectedValue(new Error('Some error'));

      expect(await service.deleteCustomer(1)).toBe(false);
    });
  });
});
