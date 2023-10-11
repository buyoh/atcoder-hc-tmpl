export interface TestcaseInfo {
  path: string;
  title: string;
}

// HTTP/REST API の抽象化
export interface IRequestHandler {
  // TODO: Consider fail case
  getAllTestcasesList(): Promise<TestcaseInfo[]>;
}
