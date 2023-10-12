import fs from 'fs';
import path from 'path';
import { IRequestHandler, TestcaseInfo } from '../../interface/Web';
import { InputFileListManager } from './InputFileListManager';
import { execCommandWithFileIO } from '../libs/ExecUtil';


// TODO: 中断するためのColtrollerと完了通知のListener
async function startSolution(
  inputFileListManager: InputFileListManager,
  solutionCwd: string,
  fileListIndices: number[]
) {
  const bashScriptPath = path.resolve(solutionCwd, 'bin/run.sh');

  const filePaths = inputFileListManager.selectPathsByIndices(fileListIndices);
  const inputBaseDir = inputFileListManager.baseDir();
  const outputBaseDir = path.resolve(solutionCwd, 'out');
  for (const filePath of filePaths) {
    const args = [bashScriptPath];
    const { code } = await execCommandWithFileIO(
      'bash',
      args,
      path.resolve(inputBaseDir, filePath),
      path.resolve(outputBaseDir, filePath + '.out.txt'),
      path.resolve(outputBaseDir, filePath + '.err.txt'),
      2000
    );
    console.log(code);
  }
}

export class RequestHandlerServerImpl implements IRequestHandler {
  private inputFileListManager: InputFileListManager;
  private solutionCwd: string;

  // TODO: remove solutionCwd
  constructor(inputFileListManager: InputFileListManager, solutionCwd: string) {
    this.inputFileListManager = inputFileListManager;
    this.solutionCwd = solutionCwd;
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
    startSolution(this.inputFileListManager, this.solutionCwd, [0, 1, 2]);
  }
}