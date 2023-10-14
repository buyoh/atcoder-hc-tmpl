export interface ITestcaseInfo {
  path: string;
  title: string;
}

export type ITaskStatus = 'pending' | 'running' | 'finished' | 'failed' | 'cancelled';

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
}

// HTTP/REST API の抽象化
export interface IRequestHandler {
  // GET /api/testcase
  // TODO: Consider fail case
  getAllTestcasesList(): Promise<ITestcaseInfo[]>;
  // POST //api/exec/start
  startSolution(): Promise<void>;

  // TODO:
  // GET //api/job
  getAllJobs(): Promise<IJob[]>;
  // GET //api/job/:id
  getJob(jobId: string): Promise<{job: IJob, tasks: ITask[]} | null>;
}
