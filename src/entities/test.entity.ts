import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Test {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  name: string;
}
