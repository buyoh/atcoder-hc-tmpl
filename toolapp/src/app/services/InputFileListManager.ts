import fs from 'fs';
import path from 'path';

export type FileInfo = {
  path: string;
};

export class InputFileListManager {
  private cwd: string;
  private list: FileInfo[] = [];

  constructor(cwd: string) {
    this.cwd = cwd;
  }

  async scan() {
    const dirStdin = this.baseDir();
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
    const dirStdin = path.resolve(this.cwd, 'out/cases');
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