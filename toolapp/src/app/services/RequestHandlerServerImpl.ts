import { IRequestHandler, TestcaseInfo } from '../../interface/Web';
import { InputFileListManager } from './InputFileListManager';
import { JobManager } from './JobManager';

export class RequestHandlerServerImpl implements IRequestHandler {
  private inputFileListManager: InputFileListManager;
  private jobManager: JobManager

  constructor(inputFileListManager: InputFileListManager, jobManager: JobManager) {
    this.inputFileListManager = inputFileListManager;
    this.jobManager = jobManager;
  }

  async getAllTestcasesList(): Promise<TestcaseInfo[]> {
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
}