import {
  IJob,
  IRequestHandler,
  ITask,
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

  async getAllTestcasesList(): Promise<ITestcaseInfo[]> {
    const filePaths = this.inputFileListManager.paths();
    return filePaths.map((filePath) => ({
      path: filePath,
      title: filePath,
    }));
  }
  async startSolution(): Promise<void> {
    this.jobManager.addJob([0, 1, 2]);
  }

  async getAllJobs(): Promise<IJob[]> {
    const jobs = await this.databaseService.getAllJobs();
    return jobs.map((job) => ({ id: job.id }));
  }

  async getJob(jobId: string): Promise<{ job: IJob; tasks: ITask[] } | null> {
    const mayJobTasksPair = await this.databaseService.getJob(jobId);
    if (!mayJobTasksPair) {
      return null;
    }
    const { tasks } = mayJobTasksPair;
    return {
      job: {
        id: jobId,
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
}
