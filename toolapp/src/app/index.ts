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
import { createDatabaseService } from './services/DatabaseService';
import { applyStaticAssetsMiddlewares } from './express/StaticServer';

dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

const cwd = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  '../../'
);
const solutionCwd = process.env.APP_WORK_DIRECTORY || path.resolve(cwd, '../');

const useViteServer = process.env.APP_FRONTEND_MIDDLEWARE !== 'static';

console.log('working directory: ', solutionCwd);

(async () => {
  const inputFileListManager = new InputFileListManager(solutionCwd);
  await inputFileListManager.scan(); // TODO: concurrent

  const databaseService = createDatabaseService();
  await databaseService.initialize();
  const jobManager = new JobManager(
    inputFileListManager,
    solutionCwd,
    databaseService
  );

  const connFactory = new ConnectionHandlerServerFactory(jobManager);
  const requestHandler = new RequestHandlerServerImpl(
    inputFileListManager,
    databaseService,
    jobManager
  );

  const app = express();
  await applyWebSocketMiddleware(app, connFactory);
  await applyRESTMiddleWare(app, requestHandler);
  if (useViteServer)
    await applyViteDevMiddlewares(app, cwd);
  else
    await applyStaticAssetsMiddlewares(app, cwd);

  app.listen(3000, () => {
    console.log('listening on port 3000');
  });
})();
