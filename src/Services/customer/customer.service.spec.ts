import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { CustomerRepositoryService } from '../../Repository/customer-repository/customer-repository.service';
import { ResponseService } from '../../helpers/services/response/response.service';
import { Customer } from '../../Models/Customer';
import { StatusEnum } from '../../helpers/Enums/ResponseEnum';
import { CustomerMessageEnum } from '../../Helpers/Enums/CustomerMessageEnum';

describe('CustomerService', () => {
  let service: CustomerService;
  let customerRepository: CustomerRepositoryService;
  let responseService: ResponseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: CustomerRepositoryService,
          useValue: {
            getAllCustomers: jest.fn(),
            getCustomer: jest.fn(),
            getAllCustomersBySearch: jest.fn(),
            createCustomer: jest.fn(),
            updateCustomer: jest.fn(),
            deleteCustomer: jest.fn(),
          },
        },
        {
          provide: ResponseService,
          useValue: {
            customFailureResponse: jest.fn(),
            customerFailureResponse: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    customerRepository = module.get<CustomerRepositoryService>(
      CustomerRepositoryService,
    );
    responseService = module.get<ResponseService>(ResponseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCustomers', () => {
    it('should return all customers with success response', async () => {
      const customers: Customer[] = [new Customer(), new Customer()];
      jest
        .spyOn(customerRepository, 'getAllCustomers')
        .mockResolvedValue(customers);

      const result = await service.getAllCustomers();
      expect(result).toEqual({
        Status: StatusEnum.success,
        Message: CustomerMessageEnum.success,
        RowsNumber: customers.length,
        Data: customers,
      });
    });

    it('should return custom failure response when no data found', async () => {
      jest.spyOn(customerRepository, 'getAllCustomers').mockResolvedValue(null);

      const result = await service.getAllCustomers();
      expect(result).toEqual(
        responseService.customFailureResponse<Customer>(
          CustomerMessageEnum.NoDataFound,
        ),
      );
    });

    it('should return customer failure response on error', async () => {
      jest
        .spyOn(customerRepository, 'getAllCustomers')
        .mockResolvedValue(false);

      const result = await service.getAllCustomers();
      expect(result).toEqual(responseService.customerFailureResponse());
    });
  });

  describe('getCustomer', () => {
    it('should return customer by id with success response', async () => {
      const customer = new Customer();
      jest.spyOn(customerRepository, 'getCustomer').mockResolvedValue(customer);

      const result = await service.getCustomer(1);
      expect(result).toEqual({
        Status: StatusEnum.success,
        Message: CustomerMessageEnum.success,
        RowsNumber: 1,
        Data: customer,
      });
    });

    it('should return custom failure response when no data found', async () => {
      jest.spyOn(customerRepository, 'getCustomer').mockResolvedValue(null);

      const result = await service.getCustomer(1);
      expect(result).toEqual(
        responseService.customFailureResponse<Customer>(
          CustomerMessageEnum.NoDataFound,
        ),
      );
    });

    it('should return customer failure response on error', async () => {
      jest.spyOn(customerRepository, 'getCustomer').mockResolvedValue(false);

      const result = await service.getCustomer(1);
      expect(result).toEqual(responseService.customerFailureResponse());
    });
  });

  describe('getAllCustomersBySearch', () => {
    it('should return filtered customers with success response', async () => {
      const customers: Customer[] = [new Customer(), new Customer()];
      jest
        .spyOn(customerRepository, 'getAllCustomersBySearch')
        .mockResolvedValue(customers);

      const result = await service.getAllCustomersBySearch('search');
      expect(result).toEqual({
        Status: StatusEnum.success,
        Message: CustomerMessageEnum.success,
        RowsNumber: customers.length,
        Data: customers,
      });
    });

    it('should return custom failure response when no data found', async () => {
      jest
        .spyOn(customerRepository, 'getAllCustomersBySearch')
        .mockResolvedValue(null);

      const result = await service.getAllCustomersBySearch('search');
      expect(result).toEqual(
        responseService.customFailureResponse<Customer>(
          CustomerMessageEnum.NoDataFound,
        ),
      );
    });

    it('should return customer failure response on error', async () => {
      jest
        .spyOn(customerRepository, 'getAllCustomersBySearch')
        .mockResolvedValue(false);

      const result = await service.getAllCustomersBySearch('search');
      expect(result).toEqual(responseService.customerFailureResponse());
    });
  });

  describe('createCustomer', () => {
    it('should create a new customer with success response', async () => {
      const customer = new Customer();
      customer.firstName = 'hassan';
      jest
        .spyOn(customerRepository, 'createCustomer')
        .mockResolvedValue(customer);

      const result = await service.createCustomer(customer);
      expect(result).toEqual({
        Status: StatusEnum.success,
        Message: CustomerMessageEnum.created,
        RowsNumber: 1,
        Data: customer,
      });
    });

    it('should return failure response when customer first name is missing', async () => {
      const customer = new Customer();
      delete customer.firstName;

      const result = await service.createCustomer(customer);
      expect(result).toEqual({
        Status: StatusEnum.failed,
        Message: CustomerMessageEnum.CustomerFirstNameRequired,
        RowsNumber: 0,
        Data: [],
      });
    });

    it('should return customer failure response on error', async () => {
      jest.spyOn(customerRepository, 'createCustomer').mockResolvedValue(false);

      const result = await service.createCustomer({
        firstName: 'hassan',
      } as Customer);
      expect(result).toEqual(responseService.customerFailureResponse());
    });
  });

  describe('updateCustomer', () => {
    it('should update an existing customer with success response', async () => {
      const customer = new Customer();
      jest
        .spyOn(customerRepository, 'updateCustomer')
        .mockResolvedValue(customer);

      const result = await service.updateCustomer(1, customer);
      expect(result).toEqual({
        Status: StatusEnum.success,
        Message: CustomerMessageEnum.updated,
        RowsNumber: 1,
        Data: customer,
      });
    });

    it('should return customer failure response on error', async () => {
      jest.spyOn(customerRepository, 'updateCustomer').mockResolvedValue(false);

      const result = await service.updateCustomer(1, new Customer());
      expect(result).toEqual(responseService.customerFailureResponse());
    });
  });

  describe('deleteCustomer', () => {
    it('should delete a customer by id with success response', async () => {
      jest.spyOn(customerRepository, 'deleteCustomer').mockResolvedValue(true);

      const result = await service.deleteCustomer(1);
      expect(result).toEqual({
        RowsNumber: 0,
        Data: [],
        Message: CustomerMessageEnum.deleted,
        Status: StatusEnum.success,
      });
    });

    it('should return customer failure response on error', async () => {
      jest.spyOn(customerRepository, 'deleteCustomer').mockResolvedValue(false);

      const result = await service.deleteCustomer(1);
      expect(result).toEqual(responseService.customerFailureResponse());
    });
  });
});
