import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CustomerPayment } from './CustomerPayment';
import { Transaction } from './Transaction';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: '15' })
  firstName: string;

  @Column({ nullable: true, type: 'nvarchar', length: '15' })
  lastName: string;

  @Column({ nullable: true, type: 'nvarchar', length: '15' })
  phone: string;

  @Column({ default: 0, nullable: true })
  debt: number;

  @Column({ type: 'simple-array', nullable: true })
  @OneToMany(() => CustomerPayment, (payment) => payment.customer)
  payments: CustomerPayment[];

  @Column({ type: 'simple-array', nullable: true })
  @OneToMany(() => Transaction, (transaction) => transaction.customer)
  transactions: Transaction[];
}
