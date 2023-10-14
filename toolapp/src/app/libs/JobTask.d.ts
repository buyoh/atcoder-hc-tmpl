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
};
