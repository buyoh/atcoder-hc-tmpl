import fs from 'fs';
import path from 'path';
import { InputFileListManager } from './InputFileListManager';
import { execCommandWithFileIO } from '../libs/ExecUtil';

export type TaskStatus = 'pending' | 'running' | 'finished' | 'failed' | 'cancelled';

export type Task = {
  inputFilePath: string;
};

export type TaskState = {
  status: TaskStatus;
  exitCode: number | null;
  score: number;
  error: string | null;
};

const kTaskStateEmpty: TaskState = {
  status: 'pending',
  exitCode: null,
  score: 0,
  error: null,
};

export type Job = {
  // id: string;
  tasks: Task[];
};

export type JobState = {
  taskStates : TaskState[];
}

// ------------------------------------

// TODO: 中断するためのColtrollerと完了通知のListener
async function startTask(
  task: Task,
  inputFileListManager: InputFileListManager,  // TODO: remove
  solutionCwd: string,
  onTaskStateChanged: (taskState: TaskState) => void
) {
  try {
    const bashScriptPath = path.resolve(solutionCwd, 'bin/run.sh');

    const inputBaseDir = inputFileListManager.baseDir();
    const outputBaseDir = path.resolve(solutionCwd, 'out');
  
    const filePath = task.inputFilePath;

    const args = [bashScriptPath];
    onTaskStateChanged({ ...kTaskStateEmpty, status: 'running'});
    const { code } = await execCommandWithFileIO(
      'bash',
      args,
      path.resolve(inputBaseDir, filePath),
      path.resolve(outputBaseDir, filePath + '.out.txt'),
      path.resolve(outputBaseDir, filePath + '.err.txt'),
      2000
    );
    onTaskStateChanged({ ...kTaskStateEmpty, status: 'finished', exitCode: code, score: 1 });
  } catch (e) {
    console.error(e);
    onTaskStateChanged({ ...kTaskStateEmpty, status: 'failed', error: `${e}` });
    // Reject しない
  }
}


// ------------------------------------

export class JobManager {

  private inputFileListManager: InputFileListManager;
  private solutionCwd: string;
  private jobs: {job: Job, jobState: JobState} [] = [];

  constructor(inputFileListManager: InputFileListManager, solutionCwd: string) {
    this.inputFileListManager = inputFileListManager;
    this.solutionCwd = solutionCwd;
  }

  startJob(jobIndex: number) {
    const { job, jobState } = this.jobs[jobIndex];
    console.log(jobIndex);
    job.tasks.map((task, taskIndex) => {
      // TODO: 同時実行数の上限
      startTask(task, this.inputFileListManager, this.solutionCwd, (taskState) => {
        console.log(taskState);
        jobState.taskStates[taskIndex] = taskState;
      });
    });
  }

  addJob(fileListIndices: number[]) {
    const filePaths = this.inputFileListManager.selectPathsByIndices(fileListIndices);

    const tasks = filePaths.map((filePath) => ({
      state: 'pending',
      inputFilePath: filePath,
      exitCode: null,
      score: 0,
    }));
    
    const job = { tasks } as Job;
    this.jobs.push({ job, jobState: { taskStates: tasks.map(() => kTaskStateEmpty) } });
    this.startJob(this.jobs.length - 1);
  }

}

