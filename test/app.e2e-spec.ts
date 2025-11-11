import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/healthcheck (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/healthcheck');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      message: 'Service is healthy',
      object: { status: 'ok' },
    });
  });
});
