import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(() => {
    const mockService: Partial<UsersService> = {
      getUserByEmail: jest.fn(),
      getUserByUsername: jest.fn(),
    };
    controller = new UsersController(mockService as UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
