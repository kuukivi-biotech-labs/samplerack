import express from 'express';
import * as models from '../models.js';

export default function samples(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.json(models.listSamples(db, { status: req.query.status }));
  });

  router.post('/', (req, res) => {
    try {
      res.status(201).json(models.createSample(db, req.body));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.get('/:id', (req, res) => {
    const sample = models.getSample(db, Number(req.params.id));
    if (!sample) return res.status(404).json({ error: 'not found' });
    res.json(sample);
  });

  router.patch('/:id', (req, res) => {
    try {
      res.json(models.updateSampleStatus(db, Number(req.params.id), req.body.status));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}
