import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('healthcheck', () => {
    it('should return health status', () => {
      const res = appController.heakthCheck();
      expect(res.success).toBe(true);
      expect(res.message).toBe('Service is healthy');
      expect(res.object).toEqual({ status: 'ok' });
    });
  });
});
