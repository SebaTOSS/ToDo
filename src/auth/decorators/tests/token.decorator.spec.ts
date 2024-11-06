import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { createMock } from '@golevelup/ts-jest';
import { Token } from '..';

function getParamDecoratorFactory(decorator: Function) {
    class TestDecorator {
        public test(@decorator() value: any) { }
    }

    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestDecorator, 'test');

    return args[Object.keys(args)[0]].factory;
}

describe('Token Decorator', () => {
  it('should return the token from the authorization header', () => {
    const mockToken = 'Bearer test-token';
    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: mockToken,
          },
        }),
      }),
    });

    const decorator = getParamDecoratorFactory(Token);
    const result = decorator(null, mockExecutionContext);

    expect(result).toEqual('test-token');
  });

  it('should throw an UnauthorizedException if the token is not found', () => {
    const mockExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    });
  

    const decorator = getParamDecoratorFactory(Token);
    expect(() => decorator(null, mockExecutionContext)).toThrow(UnauthorizedException);
  });
});