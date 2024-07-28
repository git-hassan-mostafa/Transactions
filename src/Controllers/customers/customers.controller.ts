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
import { Customer } from '../../Models/Customer';
import { CustomerService } from '../../Services/customer/customer.service';

@Controller('customers')
export class CustomersController {
  constructor(private customerService: CustomerService) {}
  @Get()
  async Read(): Promise<ResponseDTO<Customer>> {
    const allCustomers = await this.customerService.getAllCustomers();
    return allCustomers;
  }

  @Post()
  async Create(@Body() customer: Customer): Promise<ResponseDTO<Customer>> {
    const newCustomer = await this.customerService.createCustomer(customer);
    return newCustomer;
  }

  @Patch(':id')
  async Update(
    @Param('id') id: number,
    @Body() customer: Customer,
  ): Promise<ResponseDTO<Customer>> {
    const updatedCategory = await this.customerService.updateCustomer(
      id,
      customer,
    );
    return updatedCategory;
  }

  @Delete(':id')
  async Delete(@Param('id') id: number): Promise<ResponseDTO<Customer>> {
    const deleteResponse = await this.customerService.deleteCustomer(id);
    return deleteResponse;
  }

  @Get('getCustomer/:id')
  async getCustomer(@Param('id') id: number): Promise<ResponseDTO<Customer>> {
    const customer = await this.customerService.getCustomer(id);
    return customer;
  }

  @Get('searchcustomers')
  async getCustomersBySearch(
    @Query('search') search: string,
  ): Promise<ResponseDTO<Customer>> {
    const allCustomersBySearch =
      await this.customerService.getAllCustomersBySearch(search);
    return allCustomersBySearch;
  }
}
