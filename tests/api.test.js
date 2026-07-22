import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { open } from '../src/db.js';
import { createApp } from '../src/app.js';

let db;
let app;

beforeEach(() => {
  db = open(':memory:');
  app = createApp(db);
});

afterEach(() => {
  db.close();
});

describe('api', () => {
  it('answers health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it('creates a sample over HTTP', async () => {
    const res = await request(app).post('/api/samples').send({
      barcode: 'KBL-2026-0100',
      subject: 'swab, Balti jaam',
      collected_at: '2026-08-01',
    });
    expect(res.status).toBe(201);
    expect(res.body.barcode).toBe('KBL-2026-0100');
  });

  it('rejects an invalid payload with 400', async () => {
    const res = await request(app).post('/api/samples').send({ barcode: 'KBL-2026-0101' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/);
  });

  it('returns 404 for an unknown sample', async () => {
    const res = await request(app).get('/api/samples/999');
    expect(res.status).toBe(404);
  });

  it('lists plates for a sample', async () => {
    const created = await request(app).post('/api/samples').send({
      barcode: 'KBL-2026-0102',
      subject: 'sediment',
      collected_at: '2026-08-02',
    });
    await request(app).post('/api/plates').send({ sample_id: created.body.id, medium: 'TSA' });
    const res = await request(app).get(`/api/plates?sample_id=${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('exports samples as csv', async () => {
    await request(app).post('/api/samples').send({
      barcode: 'KBL-2026-0103',
      subject: 'water, "quoted" spot',
      collected_at: '2026-08-03',
    });
    const res = await request(app).get('/api/export/samples');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/csv/);
    expect(res.text.split('\n')[0]).toContain('barcode');
    expect(res.text).toContain('"water, ""quoted"" spot"');
  });
});
