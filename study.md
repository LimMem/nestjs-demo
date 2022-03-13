# 学习笔记

## 1. 创建工程

> npm i -g @nestjs/cli
> nest new project-name

## 2. 配置异常过滤器
1. 添加`src/filters/http-exception.filter.ts`文件， 可通过一下命令创建
> nest g f filters/HttpException

2. 在`src/main.ts`文件中 通过app添加全局过滤器
```javascript
import { FactoryNest } from "@nestjs/core";
import { AppModule } from './app.module';
import { HttpExceptionFilter } from 'filters/http-exception.filter.ts';

const bootstrap = async () => {
  const app = FactoryNest.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port);
};

bootstrap();
```

3. 在过滤器中可通过`HTTPException`定制自己的异常返回信息
```javascript
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    response.status(status).json({
      code: status,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
```




## 3. 增加拦截器，统一出入参
1、添加拦截器文件`interceptor/transform.interceptor.ts`, 可通过以下命令创建
> nest g in TransformInterceptor

2、在`main.ts`中添加
```javascript
import { FactoryNest } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptor/transform.interceptor';

function bootstrap(){
  const app = FactoryNest.create(AppModule);
  app.useGlobalsInterceptor(new TransformInterceptor());
  await app.listen(3000);
}

bootstrap();
```

3、 在`interceptor/transform.interceptor.ts`文件下定义自己的统一出入参
```javascript
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return { data, code: 0, message: '请求成功' };
      }),
    );
  }
}
```





## 4. TypeORM 集成

1、 安装数据库
> yarn add typeorm @nestjs/typeorm mysql2

2、 在`src/app.module.ts`中导入`TypeOrmModule`。注意: 这里使用的是mysql数据库，前提本机已经安装mysql，并且已经创建了一个database;
```javascript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

3、创建实体`entity`。在`src`文件夹下创建`entities`文件夹。并创建`test.entity.ts`实体。并添加id和name字段

```javascript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Test {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  name: string;
}

```
4、通过命令创建`test`的module、service、Controller。
> nest g mo test
> nest g s test
> nest g co test

5、在`src/test/test.module.ts`中关联数据库表
```javascript
import { Modules } from "@nestjs/common"
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from '../entities/test.entity';
import { TestService } from './test.service';
import { TestController } from './test.controller';

@Modules({
  imports: [TypeOrmModule.forFeature([Test])],
  providers: [TestService],
  controllers: [TestController]
})

```

6、编写`test.service.ts`文件代码逻辑。 例如：增加一条数据
```javascript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Test } from "../entities/test.entity.ts";


@Injectable
export class TestService {
  // 注入test实体
  constructor(@InjectRepository(Test) private readyonly testService) {}

  create(param: any): Promise<any>{
    return this.testService.save(param).then(res => {
      console.log(res);
      return res;
    })
  }
}

```

7、在`test.controller.ts`中调用服务

```javascript
import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) { }

  @Post('/create')
  create(@Body() body) {
    return this.testService.create(body);
  }
}

```

8、测试

可以通过http://localhost:3000/api/test/create调用接口

