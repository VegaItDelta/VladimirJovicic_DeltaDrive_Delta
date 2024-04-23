import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of } from 'rxjs';
import { AuthentificationInterceptor } from './authentification.interceptor';

describe('AuthentificationInterceptors', () => {
  let interceptor: AuthentificationInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthentificationInterceptor],
    }).compile();

    interceptor = module.get<AuthentificationInterceptor>(AuthentificationInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should allow request when passenger is present in session', () => {
    const mockRequest = {
      session: {
        passenger: {
          id: 1,
          name: 'John Doe'
        }
      }
    };
    const mockContext: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;
    const mockHandler: any = {
      handle: () => of('some value'),
    };

    const result = interceptor.intercept(mockContext, mockHandler);

    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Observable);
  });

  it('should throw UnauthorizedException when passenger is not present in session', () => {
    const mockRequest = {
      session: {}
    };
    const mockContext: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;
    const mockHandler: any = {
      handle: () => of('some value'),
    };

    expect(() => interceptor.intercept(mockContext, mockHandler)).toThrow(UnauthorizedException);
  });
});