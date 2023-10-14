import fs from 'fs';
import path from 'path';
import { InputFileListManager } from './InputFileListManager';
import { execCommandWithFileIO } from '../libs/ExecUtil';
import { TaskState, Task, Job, TaskStatus } from '../libs/JobTask';
import { DatabaseService } from './DatabaseService';

function generateTekitouId(): string {
  let s = '';
  while (s.length < 16) {
    s += Math.random().toString(36).slice(2);
  }
  return s.slice(-16);
}

const kTaskStateEmpty: TaskState = {
  // taskId: '',
  status: 'pending',
  exitCode: null,
  score: 0,
  error: null,
};

// ------------------------------------

// TODO: 中断するためのColtrollerと完了通知のListener
async function startTask(
  task: Task,
  inputFileListManager: InputFileListManager, // TODO: remove
  solutionCwd: string,
  onTaskStateChanged: (taskState: TaskState) => void
) {
  try {
    const bashScriptPath = path.resolve(solutionCwd, 'bin/run.sh');

    const inputBaseDir = inputFileListManager.baseDir();
    const outputBaseDir = path.resolve(solutionCwd, 'out');

    const filePath = task.inputFilePath;

    const args = [bashScriptPath];
    onTaskStateChanged({
      ...kTaskStateEmpty,
      // taskId: task.id,
      status: 'running',
    });
    const { code } = await execCommandWithFileIO(
      'bash',
      args,
      path.resolve(inputBaseDir, filePath),
      path.resolve(outputBaseDir, filePath + '.out.txt'),
      path.resolve(outputBaseDir, filePath + '.err.txt'),
      2000
    );
    onTaskStateChanged({
      ...kTaskStateEmpty,
      // taskId: task.id,
      status: 'finished',
      exitCode: code,
      score: 1,
    });
  } catch (e) {
    console.error(e);
    onTaskStateChanged({
      ...kTaskStateEmpty,
      // taskId: task.id,
      status: 'failed',
      error: `${e}`,
    });
    // Reject しない
  }
}

// ------------------------------------

export interface JobManagerListener {
  onJobListUpdated(): void;
  onJobTaskUpdated(jobId: string): void;
}

class JobManagerListenerList implements JobManagerListener {
  private listeners: JobManagerListener[] = [];

  addListener(listener: JobManagerListener) {
    this.listeners.push(listener);
  }

  removeListener(listener: JobManagerListener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  onJobListUpdated() {
    this.listeners.forEach((listener) => listener.onJobListUpdated());
  }

  onJobTaskUpdated(jobId: string) {
    this.listeners.forEach((listener) => listener.onJobTaskUpdated(jobId));
  }
}

// ------------------------------------

export class JobManager {
  private inputFileListManager: InputFileListManager;
  private solutionCwd: string;
  private databaseService: DatabaseService;
  // private jobs: { job: Job; tasks: Task[]; taskStates: TaskState[] }[] = [];
  private jobManagerListenerList = new JobManagerListenerList();

  constructor(
    inputFileListManager: InputFileListManager,
    solutionCwd: string,
    databaseService: DatabaseService
  ) {
    this.inputFileListManager = inputFileListManager;
    this.solutionCwd = solutionCwd;
    this.databaseService = databaseService;
  }

  addListener(listener: JobManagerListener) {
    this.jobManagerListenerList.addListener(listener);
  }

  removeListener(listener: JobManagerListener) {
    this.jobManagerListenerList.removeListener(listener);
  }

  //

  async startJob(jobId: string) {
    const mayJobTasksPair = await this.databaseService.getJob(jobId);
    if (!mayJobTasksPair) {
      // TODO: ハンドル方法が分からない 後で考え直す
      console.error('Job not found');
      return;
    }
    const { job, tasks } = mayJobTasksPair;

    // const { job, tasks, taskStates } = this.jobs[jobIndex];
    tasks.map((task) => {
      // TODO: 同時実行数の上限
      startTask(
        task,
        this.inputFileListManager,
        this.solutionCwd,
        async (taskState) => {
          console.log(taskState);
          // updateTaskState が終わってから onJobTaskUpdated を呼ぶ
          await this.databaseService.updateTaskState(task.id, taskState);
          this.jobManagerListenerList.onJobTaskUpdated(job.id);
        }
      );
    });
  }

  async addJob(fileListIndices: number[]) {
    const filePaths =
      this.inputFileListManager.selectPathsByIndices(fileListIndices);

    // const tasks = filePaths.map((filePath) => ({
    //   id: generateTekitouId(),
    //   state: 'pending',
    //   inputFilePath: filePath,
    //   exitCode: null,
    //   score: 0,
    // }));

    // const job: Job = { id: generateTekitouId() };
    // this.jobs.push({
    //   job,
    //   tasks,
    //   taskStates: tasks.map(() => kTaskStateEmpty),
    // });
    // this.startJob(this.jobs.length - 1);

    const job = await this.databaseService.createJobAndTasks(filePaths);

    this.startJob(job.id);

    this.jobManagerListenerList.onJobListUpdated();
  }
}
