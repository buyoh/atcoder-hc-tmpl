import { IJob, IRequestHandler, ITask, ITestcaseInfo } from '../../interface/Web';
import { InputFileListManager } from './InputFileListManager';
import { JobManager } from './JobManager';

export class RequestHandlerServerImpl implements IRequestHandler {
  private inputFileListManager: InputFileListManager;
  private jobManager: JobManager

  constructor(inputFileListManager: InputFileListManager, jobManager: JobManager) {
    this.inputFileListManager = inputFileListManager;
    this.jobManager = jobManager;
  }

  async getAllTestcasesList(): Promise<ITestcaseInfo[]> {
    const filePaths = this.inputFileListManager.paths();
    console.log(filePaths);
    return filePaths.map((filePath) => ({
      path: filePath,
      title: filePath,
    }));
  }
  async startSolution(): Promise<void> {
    this.jobManager.addJob([0, 1, 2]);
  }

  async getAllJobs(): Promise<IJob[]> {
    return this.jobManager.getAllJobs().map(({ id }) => ({
      id,
    }));
  }
  async getJob(jobId: string): Promise<{ job: IJob; tasks: ITask[]; } | null> {
    const tasks = this.jobManager.getJobTask(jobId);
    if (!tasks) {
      return null;
    }
    return {
      job: {
        id: jobId,
      },
      tasks: tasks.map((task) => ({
        id: task.id,
        jobId: task.jobId,
        inputFilePath: task.inputFilePath,
        status: task.status,
        exitCode: task.exitCode,
        score: task.score,
      })),
    };
  }
}