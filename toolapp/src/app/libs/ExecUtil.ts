import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

export async function execCommand(
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

export async function execCommandWithFileIO(
  command: string,
  args: string[],
  stdinPath: string | null,
  stdoutPath: string | null,
  stderrPath: string | null,
  timeoutMsec: number
): Promise<{ code: number }> {
  const child = spawn(command, args, {});
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
