import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { Company } from '../entities/company.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) { }

  root() {
    return 'Hello World!';
  }

  async create(): Promise<string> {
    const employee = new Employee();
    const company = new Company();
    company.name = 'asc';
    employee.name = 'novak';
    employee.age = 20;
    employee.address = 'shanghai';
    // employee.company = company;

    return this.employeeRepository
      .save(employee)
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch((err) => {
        return err;
      });
  }

  async findOne(id: string): Promise<Employee> {
    const a = await this.employeeRepository.findOne({ id: id });
    console.log(a, id);
    return a;
  }
}
