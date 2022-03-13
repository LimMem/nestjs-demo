import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) { }

  @Get()
  root() {
    return 'root';
  }
  @Post('/create')
  create(@Body() body) {
    return this.testService.create(body);
  }
}
