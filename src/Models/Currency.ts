import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: '15' })
  name: string;

  @Column({ length: '5' })
  code: string;
}
