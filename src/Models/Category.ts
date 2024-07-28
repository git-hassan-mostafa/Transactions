import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionItem } from './TransactionItem';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: '15' })
  name: string;

  @Column({ nullable: true, default: 0 })
  quantity: number;

  @Column({ nullable: false })
  price: number;

  @Column({ type: 'simple-array', nullable: true })
  @OneToMany(
    () => TransactionItem,
    (transactionItem) => transactionItem.category,
  )
  transactionItems: TransactionItem[];
}
