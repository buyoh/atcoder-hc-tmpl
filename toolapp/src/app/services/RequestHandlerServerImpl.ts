import {
  IJob,
  IRequestHandler,
  ITask,
  ITestCase,
  ITestCaseGroup,
  ITestcaseInfo,
} from '../../interface/Web';
import { DatabaseService } from './DatabaseService';
import { InputFileListManager } from './InputFileListManager';
import { JobManager } from './JobManager';

export class RequestHandlerServerImpl implements IRequestHandler {
  private inputFileListManager: InputFileListManager;
  private databaseService: DatabaseService;
  private jobManager: JobManager;

  constructor(
    inputFileListManager: InputFileListManager,
    databaseService: DatabaseService,
    jobManager: JobManager
  ) {
    this.inputFileListManager = inputFileListManager;
    this.databaseService = databaseService;
    this.jobManager = jobManager;
  }

  async startSolution(): Promise<void> {
    this.jobManager.addJob([0, 1, 2]);
  }

  async getAllJobs(): Promise<IJob[]> {
    const jobs = await this.databaseService.getAllJobs();
    return jobs.map((job) => ({
      id: job.id,
      createdAtISO: job.createdAt.toISOString(),
    }));
  }

  async getJob(jobId: string): Promise<{ job: IJob; tasks: ITask[] } | null> {
    const mayJobTasksPair = await this.databaseService.getJob(jobId);
    if (!mayJobTasksPair) {
      return null;
    }
    const { job, tasks } = mayJobTasksPair;
    return {
      job: {
        id: jobId,
        createdAtISO: job.createdAt.toISOString(),
      },
      tasks: tasks.map((task) => ({
        id: task.id,
        jobId: jobId,
        inputFilePath: task.inputFilePath,
        status: task.status,
        exitCode: task.exitCode,
        score: task.score,
      })),
    };
  }

  async getAllTestCases(): Promise<ITestCase[]> {
    const testCases = await this.databaseService.getAllTestCase();
    return testCases.map((testCase) => ({
      id: testCase.id,
      path: testCase.filePath,
    }));
  }

  async getAllTestCaseGroups(): Promise<ITestCaseGroup[]> {
    const testCaseGroups = await this.databaseService.getAllTestCaseGroups();
    return testCaseGroups.map((testCaseGroup) => ({
      id: testCaseGroup.id,
      title: testCaseGroup.title,
    }));
  }

  async getTestCaseGroup(
    id: string
  ): Promise<{ testCases: ITestCase[] } | null> {
    const mayTestCases = await this.databaseService.getTestCaseGroup(id);
    if (!mayTestCases) {
      return null;
    }
    const { testCases } = mayTestCases;
    return {
      testCases: testCases.map((testCase) => ({
        id: testCase.id,
        path: testCase.filePath,
      })),
    };
  }

  async createTestCaseGroup(title: string): Promise<ITestCaseGroup> {
    const testCaseGroup = await this.databaseService.createTestCaseGroup(title);
    return {
      id: testCaseGroup.id,
      title: testCaseGroup.title,
    };
  }

  async addTestCasesToTestCaseGroup(
    testCaseGroupId: string,
    testCaseIds: string[]
  ): Promise<void> {
    await this.databaseService.addTestCasesToTestCaseGroup(
      testCaseGroupId,
      testCaseIds
    );
  }
}
