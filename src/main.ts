import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { AppModule } from './app.module';

const port = 3000;
const prefix = 'api';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(prefix);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(port);
  console.log(`Application is running. http://localhost:${port}/${prefix}`);
}
bootstrap();
