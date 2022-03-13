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
        const result = { data: null, code: 0, message: '请求成功' };
        if (data._code) {
          result.code = data._code;
          result.message = data._message;
          result.data = data._data;
        } else {
          result.data = data;
        }
        return result;
      }),
    );
  }
}
