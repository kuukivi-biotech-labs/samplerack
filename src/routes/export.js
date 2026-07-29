import express from 'express';
import { listSamples } from '../models.js';
import { toCsv, SAMPLE_COLUMNS } from '../export.js';

export default function exporter(db) {
  const router = express.Router();

  router.get('/samples', (req, res) => {
    const rows = listSamples(db, { status: req.query.status });
    res.type('text/csv');
    res.set('Content-Disposition', 'attachment; filename="samples.csv"');
    res.send(toCsv(rows, SAMPLE_COLUMNS));
  });

  return router;
}
