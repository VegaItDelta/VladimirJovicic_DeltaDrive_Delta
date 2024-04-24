import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Observable } from 'rxjs';
import { NonAuthentificatedInterceptor } from '../../../src/interceptor';

describe('NonAuthentificatedInterceptor', () => {
  let interceptor: NonAuthentificatedInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NonAuthentificatedInterceptor],
    }).compile();

    interceptor = module.get<NonAuthentificatedInterceptor>(
      NonAuthentificatedInterceptor,
    );
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should allow requests if no passenger is present in the session', async () => {
      const mockContext: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            session: null,
          }),
        }),
      } as ExecutionContext;

      const mockCallHandler: CallHandler<any> = {
        handle: jest.fn(() => new Observable()),
      };

      const result = interceptor.intercept(mockContext, mockCallHandler);

      expect(result).toBeDefined();
      expect(mockCallHandler.handle).toHaveBeenCalled();
    });
  });
});
