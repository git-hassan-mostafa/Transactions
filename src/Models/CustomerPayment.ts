import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './Customer';
import { Transaction } from './Transaction';

@Entity()
export class CustomerPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  note?: string;

  @Column()
  date: Date;

  @ManyToOne(() => Customer, (customer) => customer.payments)
  customer: Customer;

  @ManyToOne(() => Transaction, (transaction) => transaction.payments)
  transaction: Transaction;
}
