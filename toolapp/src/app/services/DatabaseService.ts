import { Job, Task, TaskState, TestCase, TestCaseGroup } from '../libs/JobTask';
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

  createTestCaseGroup(title: string): Promise<TestCaseGroup>;
  addTestCasesToTestCaseGroup(
    testCaseGroupId: string,
    testCaseIds: string[]
  ): Promise<void>;
  getAllTestCaseGroups(): Promise<TestCaseGroup[]>;
  getTestCaseGroup(
    id: string
  ): Promise<{ testCases: TestCase[] } | null>;
  getAllTestCase(): Promise<TestCase[]>;

  syncTestCases(filePaths: string[]): Promise<void>;
}

export function createDatabaseService(): DatabaseService {
  const dataSource = createDataSource(null);
  return new DatabaseServiceTypeorm(dataSource);
}
