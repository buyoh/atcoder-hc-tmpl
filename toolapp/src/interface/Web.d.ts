export interface ITestcaseInfo {  // Obsolate
  path: string;
  title: string;
}

export interface ITestCaseGroup {
  id: string;
  title: string;
  // testcases: ITestcaseInfo[];
}

export interface ITestCase {
  id: string;
  path: string;
}

export type ITaskStatus =
  | 'pending'
  | 'running'
  | 'finished'
  | 'failed'
  | 'cancelled';

export interface ITask {
  id: string;
  jobId: string;
  inputFilePath: string;
  status: ITaskStatus;
  exitCode: number | null;
  score: number;
}

export interface IJob {
  id: string;
  createdAtISO: string;
}

// HTTP/REST API の抽象化
export interface IRequestHandler {
  // TODO: Consider fail case
  // POST //api/exec/start
  startSolution(): Promise<void>;

  // GET //api/job
  getAllJobs(): Promise<IJob[]>;
  // GET //api/job/:id
  getJob(jobId: string): Promise<{ job: IJob; tasks: ITask[] } | null>;

  // GET /api/testcase
  getAllTestCases(): Promise<ITestCase[]>;

  // GET //api/testcasegroup
  getAllTestCaseGroups(): Promise<ITestCaseGroup[]>;
  // GET //api/testcasegroup/:id
  getTestCaseGroup(
    id: string
  ): Promise<{ testCases: ITestCase[] } | null>;
  // POST //api/testcasegroup
  createTestCaseGroup(title: string): Promise<ITestCaseGroup>;
  // POST //api/testcasegroup/:id/testcase
  // body: {testcaseIds: string[]}
  addTestCasesToTestCaseGroup(
    testCaseGroupId: string,
    testCaseIds: string[]
  ): Promise<void>;
}

// websocket API の抽象化
// サーバからクライアントへ
export interface IConnectionHandlerToClient {
  onJobListUpdated(): void;
  onTaskListUpdated(jobId: string): void;
}

// websocket API の抽象化
// クライアントからサーバへ
export interface IConnectionHandlerToServer {
  // subscribeSomething(id: string | null): void;
}

// NotImplemented...
export interface IConnectionStateObserver {
  onConnected(): void;
  onDisconnected(): void;
}
