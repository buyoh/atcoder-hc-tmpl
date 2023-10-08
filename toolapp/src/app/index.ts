import express from 'express';
import { createViteDevServer } from './ViteDevServer';

// const app = express();

createViteDevServer('./').then(({ app }) => {
  // app.use(app2);

  app.listen(3000, () => {
    console.log('listening on port 3000');
  });
});
