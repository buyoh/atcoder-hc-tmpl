export interface TestcaseInfo {
  path: string;
  title: string;
}

// HTTP/REST API の抽象化
export interface IRequestHandler {
  // GET /api/testcase
  // TODO: Consider fail case
  getAllTestcasesList(): Promise<TestcaseInfo[]>;
  // POST //api/exec/start
  startSolution(): Promise<void>;

  // TODO:
  // GET //api/job
  // GET //api/job/:id
}
