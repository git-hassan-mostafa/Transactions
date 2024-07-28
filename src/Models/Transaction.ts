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

  @Column({ type: 'nvarchar', length: 'Max', nullable: true })
  description?: string;

  @Column({ nullable: true, default: false })
  isCompleted?: boolean;

  @Column({ type: 'bit' })
  transactionType: number;

  @Column({ nullable: true, default: 0 })
  totalPrice?: number;

  @Column({ nullable: true, default: 0 })
  discountPrice?: number;

  @Column({ nullable: true, default: 0 })
  discountPercentage?: number;

  @Column({ nullable: true, default: 0 })
  payedPrice?: number;

  @Column()
  date: Date;

  @ManyToOne(() => Customer, (customer) => customer.payments)
  customer: Customer;

  @Column({ type: 'simple-array', nullable: true })
  @OneToMany(
    () => TransactionItem,
    (transactionItem) => transactionItem.transaction,
  )
  transactionItems?: TransactionItem[];

  @Column({ type: 'simple-array', nullable: true })
  @OneToMany(() => CustomerPayment, (payment) => payment.transaction)
  payments?: CustomerPayment[];
}
