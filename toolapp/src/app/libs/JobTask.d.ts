export type TaskStatus =
  | 'pending'
  | 'running'
  | 'finished'
  | 'failed'
  | 'cancelled';

export type Task = {
  id: string;
  inputFilePath: string;
};

export type TaskState = {
  // taskId: string;  // TODO: remove
  status: TaskStatus;
  exitCode: number | null;
  score: number;
  error: string | null;
};

export type Job = {
  id: string;
  createdAt: Date;
};

export type TestCase = {
  id: string;
  filePath: string;
  available: boolean;
};

export type TestCaseGroup = {
  id: string;
  title: string;
  type: number;  // TODO: enum. always 0
};