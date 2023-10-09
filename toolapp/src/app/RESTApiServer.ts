import fs from 'fs';
import path from 'path';
import { Express } from 'express';
import { spawn } from 'child_process';

async function execCommand(
  command: string,
  args: string[],
  stdin: string | null,
  timeoutMsec: number
): Promise<{ stdout: string; stderr: string; code: number }> {
  const child = spawn(command, args, {
    stdio: ['pipe', 'pipe', 'pipe'],

  });
  let stdout = '';
  let stderr = '';
  if (stdin !== null) {
    child.stdin.write(stdin);
    child.stdin.end();
  }
  // let code = 0;
  return new Promise((resolve, reject) => {
    child.stdout.on('data', (data: string) => {
      stdout += data;
    });
    child.stderr.on('data', (data: string) => {
      stderr += data;
    });
    child.on('close', (code: number) => {
      resolve({ stdout, stderr, code });
    });
    setTimeout(() => {
      child.kill();
      reject(new Error('Timeout'));
    }, timeoutMsec);
  });
}

async function execCommandWithFileIO(
  command: string,
  args: string[],
  stdinPath: string | null,
  stdoutPath: string | null,
  stderrPath: string | null,
  timeoutMsec: number): Promise<{ code: number }> {
  const child = spawn(command, args, {
  });
  let stdin, stdout, stderr;
  try {
    // createReadStream may throw an error
    stdin = stdinPath !== null ? fs.createReadStream(stdinPath) : undefined;
    stdout = stdoutPath !== null ? fs.createWriteStream(stdoutPath) : undefined;
    stderr = stderrPath !== null ? fs.createWriteStream(stderrPath) : undefined;
    if (stdin) stdin.pipe(child.stdin);
    if (stdout) child.stdout.pipe(stdout);
    if (stderr) child.stderr.pipe(stderr);
  } catch (e) {
    child.kill();
    if (stdin) stdin.close();
    if (stdout) stdout.close();
    if (stderr) stderr.close();
    throw e;
  }
  return new Promise((resolve, reject) => {
    child.on('close', (code: number) => {
      resolve({ code });
    });
    setTimeout(() => {
      child.kill();
      reject(new Error('Timeout'));
    }, timeoutMsec);
  });
}


type FileInfo = {
  path: string;
};

class InputFileList {
  private cwd: string;
  private list: FileInfo[] = [];

  constructor(cwd: string) {
    this.cwd = cwd;
  }

  async scan() {
    const dirStdin = path.resolve(this.cwd, 'stdin/');
    const res = await fs.promises.readdir(dirStdin);
    this.list = res.map((filename) => {
      return { path: filename };
    });
  }

  saveListFile() {
    // TODO:
  }

  loadListFile() {
    // TODO:
  }

  baseDir(): string {
    const dirStdin = path.resolve(this.cwd, 'stdin');
    return dirStdin;
  }

  // TODO: refactoring
  paths(): string[] {
    return this.list.map((fileInfo) => fileInfo.path);
  }

  selectPathsByIndices(indices: number[]): string[] {
    return indices.map((index) => this.list[index].path);
  }
}

// TODO: 中断するためのColtrollerと完了通知のListener
async function startSolution(
  inputFileList: InputFileList,
  solutionCwd: string,
  fileListIndices: number[]
) {
  const bashScriptPath = path.resolve(solutionCwd, 'bin/run.sh');

  const filePaths = inputFileList.selectPathsByIndices(fileListIndices);
  const inputBaseDir = inputFileList.baseDir();
  const outputBaseDir = path.resolve(solutionCwd, 'out');
  for (const filePath of filePaths) {
    const args = [bashScriptPath];
    const { code } = await execCommandWithFileIO(
      'bash',
      args,
      path.resolve(inputBaseDir,  filePath),
      path.resolve(outputBaseDir, filePath + '.out.txt'),
      path.resolve(outputBaseDir, filePath + '.err.txt'),
      2000
    );
    console.log(code);
  }
}

export async function applyRESTMiddleWare(app: Express, cwd: string, solutionCwd: string): Promise<void> {
  const inputFileList = new InputFileList(solutionCwd);
  await inputFileList.scan();  // TODO: concurrent

  app.get('/api', (req, res) => {
    res.json({ message: 'Hello from server!' });
  });

  app.post('/api/exec/start', async (req, res, next) => {
    try {
      await startSolution(inputFileList, solutionCwd, [0, 1, 2]);
      res.json({ message: 'Hello from server!' });
    } catch (error) {
      next(error);
    }
  });
}
