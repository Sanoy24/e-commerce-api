import { Test } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;

  beforeEach(() => {
    const mockService: Partial<OrdersService> = {
      createOrder: jest.fn(),
      findUserOrders: jest.fn(),
    };
    controller = new OrdersController(mockService as OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
