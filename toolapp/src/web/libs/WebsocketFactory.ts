import {
  IConnectionHandlerToClient,
  IConnectionHandlerToServer,
} from '../../interface/Web';

const K_WS_URL = ((import.meta as any).env.VITE_WEBSOCKET_URL || '') as string;

// ------------------------------------

function unwrapJson(jsonText: string): { ok: false } | { ok: true; json: any } {
  try {
    const json = JSON.parse(jsonText);
    return { ok: true, json };
  } catch (e) {
    console.warn('ws: error:', e);
    return { ok: false };
  }
}

function bindWebSocket(
  ws: WebSocket,
  listener: IConnectionHandlerToClient
): IConnectionHandlerToServer {
  ws.onopen = (e) => {
    //
  };
  ws.onmessage = (event) => {
    const jsonText = event.data.toString();
    console.log('ws: received:', jsonText);

    const jres = unwrapJson(jsonText);
    if (!jres.ok) {
      return; // ignore
    }
    const json = jres.json;
    // TODO: validate json
    if (json.method === 'onJobListUpdated') {
      listener.onJobListUpdated();
    } else if (json.method === 'onTaskListUpdated') {
      const { jobId } = json.data;
      listener.onTaskListUpdated(jobId);
    }
  };

  return {};
}

class ConnectionHandlerToClientList implements IConnectionHandlerToClient {
  li: IConnectionHandlerToClient[] = [];
  constructor() {}

  addListener(li: IConnectionHandlerToClient) {
    this.li.push(li);
  }
  removeListener(li: IConnectionHandlerToClient) {
    this.li = this.li.filter((x) => x !== li);
  }

  onJobListUpdated(): void {
    this.li.forEach((x) => x.onJobListUpdated());
  }
  onTaskListUpdated(jobId: string): void {
    this.li.forEach((x) => x.onTaskListUpdated(jobId));
  }
}

// ------------------------------------

function setup() {
  const ws = new WebSocket(K_WS_URL);
  const toClientList = new ConnectionHandlerToClientList();
  bindWebSocket(ws, toClientList);

  return { ws, toClientMaster: toClientList };
}

const { ws, toClientMaster } = setup();

// ------------------------------------

export function subscribeWebSocketHandler(
  listener: IConnectionHandlerToClient
): IConnectionHandlerToServer {
  toClientMaster.addListener(listener);
  return {}; // TODO:
}

export function unsubscribeWebSocketHandler(
  listener: IConnectionHandlerToClient
) {
  toClientMaster.removeListener(listener);
}
