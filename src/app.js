import express from 'express';
import samples from './routes/samples.js';
import plates from './routes/plates.js';
import exporter from './routes/export.js';

export function createApp(db) {
  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ ok: true }));

  app.use('/api/samples', samples(db));
  app.use('/api/plates', plates(db));
  app.use('/api/export', exporter(db));

  app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'internal error' });
  });

  return app;
}
