import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './Category';
import { Transaction } from './Transaction';

@Entity()
export class TransactionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Category, (category) => category.transactionItems)
  category: Category;

  @ManyToOne(() => Transaction, (category) => category.transactionItems)
  transaction: Transaction;
}
