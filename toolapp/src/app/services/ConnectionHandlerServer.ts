import { IConnectionHandlerToClient, IConnectionHandlerToServer } from "../../interface/Web";
import { JobManager, JobManagerListener } from "./JobManager";

export interface ConnectionHandler {
  disconnect(): void;
}

// ------------------------------------

class JobManagerListenerImpl implements JobManagerListener {
  private client: IConnectionHandlerToClient;

  constructor(client: IConnectionHandlerToClient) {
    this.client = client;
  }

  onJobListUpdated() {
    this.client.onJobListUpdated();
  }

  onJobTaskUpdated(jobId: string) {
    this.client.onTaskListUpdated(jobId);
  }
}

class ConnectionHandlerImpl implements ConnectionHandler, IConnectionHandlerToServer {
  private client: IConnectionHandlerToClient;
  private jobManager: JobManager;
  private jobManagerListenerImpl: JobManagerListenerImpl;

  constructor(client: IConnectionHandlerToClient, jobManager: JobManager) {
    this.client = client;
    this.jobManager = jobManager;
    this.jobManagerListenerImpl = new JobManagerListenerImpl(client);
    this.jobManager.addListener(this.jobManagerListenerImpl);
  }

  disconnect() {
    this.jobManager.removeListener(this.jobManagerListenerImpl);
  }
}

export class ConnectionHandlerServerFactory {
  private jobManager: JobManager;

  constructor(jobManager: JobManager) {
    this.jobManager = jobManager;
  }

  startConnection(client: IConnectionHandlerToClient):
    ConnectionHandler & IConnectionHandlerToServer {

    const handler = new ConnectionHandlerImpl(client, this.jobManager);
    
    return handler;
  }
}