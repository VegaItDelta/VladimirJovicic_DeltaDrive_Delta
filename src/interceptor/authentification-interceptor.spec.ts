import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of } from 'rxjs';
import { AuthentificationInterceptors } from './authentification.interceptor';

describe('AuthentificationInterceptors', () => {
  let interceptor: AuthentificationInterceptors;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthentificationInterceptors],
    }).compile();

    interceptor = module.get<AuthentificationInterceptors>(AuthentificationInterceptors);
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