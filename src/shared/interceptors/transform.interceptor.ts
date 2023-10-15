import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

export interface SucessResponse<T> {
  statusCode: number;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, SucessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SucessResponse<T>> {
    const statusCode = context
      .switchToHttp()
      .getResponse<Response>().statusCode;

    return next.handle().pipe(map((data) => ({ data, statusCode })));
  }
}
