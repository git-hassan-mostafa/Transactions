import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: '15' })
  name: string;

  @Column({ nullable: true, default: 0 })
  @Column()
  quantity?: number;

  @Column({ nullable: false })
  @Column()
  price: number;
}
