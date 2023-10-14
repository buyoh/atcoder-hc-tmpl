import { Job, Task, TaskState } from '../libs/JobTask';
import { createDataSource } from '../typeorm/DataSource';
import { DatabaseServiceTypeorm } from '../typeorm/DatabaseServiceTypeorm';

export interface DatabaseService {
  initialize(): Promise<void>;

  createJobAndTasks(fileList: string[]): Promise<Job>;
  getAllJobs(): Promise<Job[]>;
  getJob(
    jobId: string
  ): Promise<{ job: Job; tasks: (Task & TaskState)[] } | null>;
  updateTaskState(taskId: string, state: TaskState): Promise<boolean>;
}

export function createDatabaseService(): DatabaseService {
  const dataSource = createDataSource(null);
  return new DatabaseServiceTypeorm(dataSource);
}
