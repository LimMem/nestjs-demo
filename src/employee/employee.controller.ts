import { Get, Controller, Param } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Employee } from '../entities/employee.entity';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) { }

  @Get('findOne/:id')
  async findOne(@Param() params): Promise<Employee> {
    console.log(params.id);
    return this.employeeService.findOne(params.id);
  }

  @Get('create')
  async create(): Promise<string> {
    return this.employeeService.create();
  }
}
