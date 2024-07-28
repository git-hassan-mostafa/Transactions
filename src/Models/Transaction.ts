import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './Customer';
import { CustomerPayment } from './CustomerPayment';
import { TransactionItem } from './TransactionItem';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar' })
  title: string;

  @Column({ type: 'nvarchar', length: 'Max' })
  description: string;

  @Column()
  isCompleted: boolean;

  @Column({ type: 'bit' })
  transactionType: number;

  @Column()
  totalPrice: number;

  @Column()
  discountPrice: number;

  @Column()
  discountPercentage: number;

  @Column()
  payedPrice: number;

  @Column()
  date: Date;

  @ManyToOne(() => Customer, (customer) => customer.payments)
  customer: Customer;

  @Column({ type: 'simple-array', nullable: true })
  @OneToMany(
    () => TransactionItem,
    (transactionItem) => transactionItem.transaction,
  )
  transactionItems: TransactionItem[];

  @Column({ type: 'simple-array', nullable: true })
  @OneToMany(() => CustomerPayment, (payment) => payment.transaction)
  payments: CustomerPayment[];
}
