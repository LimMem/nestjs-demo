import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Test } from '../entities/test.entity';

@Injectable()
export class TestService {
  constructor(@InjectRepository(Test) private readonly testService) { }
  async create(params: any): Promise<string> {
    return this.testService.save(params).catch((err) => {
      console.log(err.sqlMessage);
      return {
        _code: -1,
        _message: err.sqlMessage,
      };
    });
  }
}
