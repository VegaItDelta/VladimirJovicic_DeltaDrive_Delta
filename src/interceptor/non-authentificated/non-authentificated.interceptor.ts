import { CallHandler, ConflictException, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Interceptor to guard requests to prevent logged users to access endoints like login or register
 */
export class NonAuthentificatedInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {

    // Get the request
    const request = context.switchToHttp().getRequest();

    // Check if a passenger is present in the session
    if (request?.session?.passenger != null) {
      // If a passenger is present then throw exception
      throw new ConflictException();
    }

    return handler.handle();

  }
}