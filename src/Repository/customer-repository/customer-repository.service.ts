import { Injectable } from '@nestjs/common';
import { Customer } from '../../Models/Customer';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CustomerRepositoryService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}
  async getAllCustomers(): Promise<Customer[] | boolean> {
    try {
      const customers = await this.customerRepository.find();
      return customers;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  async getCustomer(id: number): Promise<Customer | boolean> {
    try {
      const category = await this.customerRepository.findOne({
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

  async getAllCustomersBySearch(search: string): Promise<Customer[] | boolean> {
    try {
      const filteredCustomers = await this.customerRepository.find({
        where: [
          { firstName: ILike(`%${search || ''}%`) },
          { lastName: ILike(`%${search || ''}%`) },
        ],
      });
      return filteredCustomers;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  async createCustomer(customer: Customer): Promise<Customer | boolean> {
    try {
      const newCustomer = this.customerRepository.create(customer);
      const createdCustomer = await this.customerRepository.save(newCustomer);
      return createdCustomer;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  async updateCustomer(
    id: number,
    customer: Customer,
  ): Promise<Customer | boolean> {
    try {
      const customerToUpdate = await this.customerRepository.findOne({
        where: { id },
      });
      const updatedCustomer = await this.customerRepository.save({
        id,
        ...customerToUpdate,
        ...customer,
      });
      return updatedCustomer;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteCustomer(id: number): Promise<boolean> {
    try {
      const deletedCustomer = await this.customerRepository.delete(id);
      const nbRowsAffected = deletedCustomer.affected;
      return nbRowsAffected > 0;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
