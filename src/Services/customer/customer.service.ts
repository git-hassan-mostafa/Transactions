import { Injectable } from '@nestjs/common';
import { ResponseDTO } from '../../Helpers/DTO/ResponseDTO';
import { Customer } from '../../Models/Customer';
import { CustomerRepositoryService } from '../../Repository/customer-repository/customer-repository.service';
import { ResponseService } from '../../helpers/services/response/response.service';
import { StatusEnum } from '../../helpers/Enums/ResponseEnum';
import { CustomerMessageEnum } from '../../Helpers/Enums/CustomerMessageEnum';

@Injectable()
export class CustomerService {
  constructor(
    private customerRepository: CustomerRepositoryService,
    private responseService: ResponseService,
  ) {}
  async getAllCustomers(): Promise<ResponseDTO<Customer>> {
    const allCustomers = await this.customerRepository.getAllCustomers();
    var response: ResponseDTO<Customer>;
    if (allCustomers) {
      return (response = {
        Status: StatusEnum.success,
        Message: CustomerMessageEnum.success,
        RowsNumber: (allCustomers as Customer[]).length,
        Data: allCustomers,
      });
    }
    if (allCustomers === null) {
      return this.responseService.customFailureResponse<Customer>(
        CustomerMessageEnum.NoDataFound,
      );
    }
    return this.responseService.customerFailureResponse();
  }

  async getCustomer(id: number): Promise<ResponseDTO<Customer>> {
    const customer = await this.customerRepository.getCustomer(id);
    var response: ResponseDTO<Customer>;
    if (customer) {
      return (response = {
        Status: StatusEnum.success,
        Message: CustomerMessageEnum.success,
        RowsNumber: 1,
        Data: customer,
      });
    }
    if (customer === null) {
      return this.responseService.customFailureResponse<Customer>(
        CustomerMessageEnum.NoDataFound,
      );
    }
    response = this.responseService.customerFailureResponse();
    return response;
  }

  async getAllCustomersBySearch(
    search: string,
  ): Promise<ResponseDTO<Customer>> {
    const searchCustomers =
      await this.customerRepository.getAllCustomersBySearch(search);
    var response: ResponseDTO<Customer>;
    if (searchCustomers) {
      return (response = {
        Status: StatusEnum.success,
        Message: CustomerMessageEnum.success,
        RowsNumber: (searchCustomers as Customer[]).length,
        Data: searchCustomers,
      });
    }

    if (searchCustomers == null) {
      return this.responseService.customFailureResponse<Customer>(
        CustomerMessageEnum.NoDataFound,
      );
    }
    response = this.responseService.customerFailureResponse();
    return response;
  }

  async createCustomer(customer: Customer): Promise<ResponseDTO<Customer>> {
    var response: ResponseDTO<Customer>;
    if (!customer.firstName) {
      return (response = {
        Status: StatusEnum.failed,
        Message: CustomerMessageEnum.CustomerFirstNameRequired,
        RowsNumber: 0,
        Data: [],
      });
    }
    const newCustomer = await this.customerRepository.createCustomer(customer);
    if (newCustomer) {
      return (response = {
        Status: StatusEnum.success,
        Message: CustomerMessageEnum.created,
        RowsNumber: 1,
        Data: newCustomer,
      });
    }
    response = this.responseService.customerFailureResponse();
    return response;
  }

  async updateCustomer(
    id: number,
    customer: Customer,
  ): Promise<ResponseDTO<Customer>> {
    const updatedCustomer = await this.customerRepository.updateCustomer(
      id,
      customer,
    );
    var response: ResponseDTO<Customer>;
    if (updatedCustomer) {
      return (response = {
        Status: StatusEnum.success,
        Message: CustomerMessageEnum.updated,
        RowsNumber: 1,
        Data: updatedCustomer,
      });
    }
    response = this.responseService.customerFailureResponse();
    return response;
  }

  async deleteCustomer(id: number): Promise<ResponseDTO<Customer>> {
    const isRowSuccessfullyDeleted =
      await this.customerRepository.deleteCustomer(id);
    var response: ResponseDTO<Customer>;
    if (isRowSuccessfullyDeleted) {
      return (response = {
        RowsNumber: 0,
        Data: [],
        Message: CustomerMessageEnum.deleted,
        Status: StatusEnum.success,
      });
    }
    response = this.responseService.customerFailureResponse();
    return response;
  }
}
