import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(() => {
    const mockService: Partial<AuthService> = {
      register: jest.fn(),
      login: jest.fn(),
    };
    controller = new AuthController(mockService as AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
