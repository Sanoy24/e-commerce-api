import { Test } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(() => {
    const mockService: Partial<ProductsService> = {
      create: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };
    controller = new ProductsController(mockService as ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
