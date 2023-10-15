import { Express } from 'express';
import ExpressWs from 'express-ws';
import { ConnectionHandlerServerFactory } from '../services/ConnectionHandlerServer';
import {
  IConnectionHandlerToClient,
  IConnectionHandlerToServer,
} from '../../interface/Web';
import * as WS from 'ws';

// ------------------------------------

class ConnectionHandlerToClientImpl implements IConnectionHandlerToClient {
  ws: WS.WebSocket | null;

  constructor(ws: WS.WebSocket) {
    this.ws = ws;
  }

  onJobListUpdated(): void {
    if (this.ws) this.ws.send(JSON.stringify({ method: 'onJobListUpdated' }));
  }
  onTaskListUpdated(jobId: string): void {
    if (this.ws)
      this.ws.send(
        JSON.stringify({ method: 'onJobListUpdated', data: { jobId } })
      );
  }

  invalidate() {
    this.ws = null;
  }
}

// ------------------------------------

function parseMessageAndHandle(
  handler: IConnectionHandlerToServer,
  message: string
) {
  console.log('ws message: ', message);
  // TODO:
}

// ------------------------------------

// express-ws: Important: Make sure to set up the express-ws module like above before loading or defining your routers!
export async function applyWebSocketMiddleware(
  app1: Express,
  connFactory: ConnectionHandlerServerFactory
): Promise<ExpressWs.Instance> {
  const expressWs = ExpressWs(app1);
  const app = expressWs.app;

  app.ws('/ws', (ws, req) => {
    const toClient = new ConnectionHandlerToClientImpl(ws);
    const handler = connFactory.startConnection(toClient);

    const finalize = () => {
      toClient.invalidate();
      handler.disconnect();
    };

    ws.on('message', (msg) => {
      parseMessageAndHandle(handler, msg.toString());
    });

    ws.on('close', () => {
      finalize();
    });

    ws.on('error', (err) => {
      console.warn('ws error: ', err);
      finalize();
    });
  });
  return expressWs;
}
