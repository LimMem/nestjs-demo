import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { Company } from './company.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  address: string;

  // @ManyToOne((type) => Company, (company) => company.employees, {
  //   cascade: true,
  // })
  // @JoinTable()
  // company: Company;
}
