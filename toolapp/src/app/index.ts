import express from 'express';
import path from 'path';
import { applyViteDevMiddlewares } from './express/ViteDevServer';
import { applyRESTMiddleWare } from './express/RESTApiServer';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

const cwd = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  '../../'
);
const solutionCwd = process.env.APP_WORK_DIRECTORY || path.resolve(cwd, '../');

console.log('working directory: ', solutionCwd);

(async () => {
  const app = express();
  await applyRESTMiddleWare(app, cwd, solutionCwd);
  await applyViteDevMiddlewares(app, cwd);

  app.listen(3000, () => {
    console.log('listening on port 3000');
  });
})();
