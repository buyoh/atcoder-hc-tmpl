import express from 'express';
import path from 'path';
import { applyViteDevMiddlewares } from './ViteDevServer';
import { applyRESTMiddleWare } from './RESTApiServer';

const cwd = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../');
const solutionCwd = path.resolve(cwd, '../');

(async () => {
  const app = express();
  await applyRESTMiddleWare(app, cwd, solutionCwd);
  await applyViteDevMiddlewares(app, cwd);
  
  app.listen(3000, () => {
    console.log('listening on port 3000');
  });
})();
