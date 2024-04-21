import { CallHandler, ExecutionContext, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Interceptor to guard requests for unauthorized access
 */
export class AuthentificationInterceptor implements NestInterceptor {
 public intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {

  // Get the request
  const request = context.switchToHttp().getRequest();

  // Check if a passenger is present in the session
  if (request?.session?.passenger == null) {
    // If a passenger is not present then throw exception
    throw new UnauthorizedException();
  }

  // If a request is preent proceed with the request
  return handler.handle();

 }
}