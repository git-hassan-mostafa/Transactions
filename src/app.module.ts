import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersController } from './controllers/customers/customers.controller';
import { CategoriesController } from './controllers/categories/categories.controller';
import { CustomerRepositoryService } from './Repository/customer-repository/customer-repository.service';
import { CategoryRepositoryService } from './Repository/category-repository/category-repository.service';
import { CategoryService } from './Services/category/category.service';
import { CustomerService } from './Services/customer/customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './Models/Category';
import { Customer } from './Models/Customer';
import { CustomerPayment } from './Models/CustomerPayment';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ResponseService } from './helpers/services/response/response.service';
import { Currency } from './Models/Currency';
import { Transaction } from './Models/Transaction';
import { TransactionItem } from './Models/TransactionItem';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      username: 'sa',
      host: 'localhost',
      port: 1433,
      password: '',
      database: 'Transactions',
      entities: [
        Customer,
        CustomerPayment,
        Category,
        Currency,
        Transaction,
        TransactionItem,
      ],
      synchronize: true,
      extra: {
        options: {
          encrypt: false,
        },
      },
    }),
    TypeOrmModule.forFeature([
      Customer,
      CustomerPayment,
      Category,
      Currency,
      Transaction,
      TransactionItem,
    ]),
  ],
  controllers: [AppController, CustomersController, CategoriesController],
  providers: [
    AppService,
    CategoryService,
    CustomerService,
    CustomerRepositoryService,
    CategoryRepositoryService,
    ResponseService,
  ],
})
export class AppModule {}
