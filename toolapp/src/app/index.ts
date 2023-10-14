import express from 'express';
import path from 'path';
import { applyViteDevMiddlewares } from './express/ViteDevServer';
import { applyRESTMiddleWare } from './express/RESTApiServer';
import dotenv from 'dotenv';
import { JobManager } from './services/JobManager';
import { InputFileListManager } from './services/InputFileListManager';
import { RequestHandlerServerImpl } from './services/RequestHandlerServerImpl';
import { applyWebSocketMiddleware } from './express/WebSocketServer';
import { ConnectionHandlerServerFactory } from './services/ConnectionHandlerServer';

dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

const cwd = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  '../../'
);
const solutionCwd = process.env.APP_WORK_DIRECTORY || path.resolve(cwd, '../');

console.log('working directory: ', solutionCwd);

(async () => {
  const inputFileListManager = new InputFileListManager(solutionCwd);
  await inputFileListManager.scan(); // TODO: concurrent

  const jobManager = new JobManager(inputFileListManager, solutionCwd);

  const connFactory = new ConnectionHandlerServerFactory(jobManager);
  const requestHandler = new RequestHandlerServerImpl(
    inputFileListManager,
    jobManager
  );

  const app = express();
  await applyWebSocketMiddleware(app, connFactory);
  await applyRESTMiddleWare(app, requestHandler);
  await applyViteDevMiddlewares(app, cwd);

  app.listen(3000, () => {
    console.log('listening on port 3000');
  });
})();
