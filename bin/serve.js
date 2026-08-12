import { open } from '../src/db.js';
import { createApp } from '../src/app.js';

const port = Number(process.env.PORT || 3000);
const db = open();
const app = createApp(db);

const server = app.listen(port, () => {
  console.log(`samplerack listening on http://localhost:${port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => {
      db.close();
      process.exit(0);
    });
  });
}
