import express from 'express';
import * as models from '../models.js';

export default function plates(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.json(models.listPlates(db, req.query.sample_id ? Number(req.query.sample_id) : undefined));
  });

  router.post('/', (req, res) => {
    try {
      res.status(201).json(models.createPlate(db, req.body));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.get('/:id', (req, res) => {
    const plate = models.getPlate(db, Number(req.params.id));
    if (!plate) return res.status(404).json({ error: 'not found' });
    res.json(plate);
  });

  router.patch('/:id', (req, res) => {
    try {
      res.json(models.setPlateReadout(db, Number(req.params.id), req.body.readout));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}
