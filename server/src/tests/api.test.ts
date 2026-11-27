import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { seedData } from '../scripts/seed.js';

describe('Blinkit Server API Integration Tests', () => {
  let app: any;
  let adminToken: string;

  beforeAll(async () => {
    await connectDB();
    await seedData(false);
    app = createApp();
  }, 30000);

  afterAll(async () => {
    await disconnectDB();
  });

  it('GET /health returns 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('blinkit-fulfillment-server');
  });

  it('POST /api/v1/auth/login authenticates Admin with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@blinkit.com', password: 'Blinkit@123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('ADMIN');
    expect(res.body.data.accessToken).toBeDefined();

    adminToken = res.body.data.accessToken;
  });

  it('POST /api/v1/auth/login rejects invalid password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@blinkit.com', password: 'WrongPassword' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/analytics/overview returns metrics when authenticated', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/overview')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.metrics.totalOrders).toBeGreaterThan(0);
    expect(res.body.data.metrics.slaComplianceRate).toBeDefined();
  });

  it('GET /api/v1/analytics/stage-breakdown returns funnel telemetry', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/stage-breakdown')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.stages).toHaveLength(5);
  });

  it('POST /api/v1/predict/delay returns delay probability and risk level', async () => {
    const res = await request(app)
      .post('/api/v1/predict/delay')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        itemCount: 5,
        hour: 19,
        storeLoadIndex: 1.2,
        aisleSpreadCount: 3,
        pickerExperience: 'MID',
        weatherCondition: 'CLEAR',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.delayProbability).toBeDefined();
    expect(res.body.data.riskLevel).toBeDefined();
  });
});
