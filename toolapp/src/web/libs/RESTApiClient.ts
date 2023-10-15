import {
  IJob,
  IRequestHandler,
  ITask,
  ITestCase,
  ITestCaseGroup,
} from '../../interface/Web';

const K_API_URL = ((import.meta as any).env.VITE_API_URL || '') as string;

async function handleError(response: Response): Promise<any> {
  if (response.status !== 200) {
    console.warn('HTTP Error: ' + response.status);
    throw new Error('HTTP Error: ' + response.status);
  }
  const json = await response.json();

  if (json.err !== null) {
    console.warn('API Error: ' + JSON.stringify(json.err));
    throw new Error('API Error: ' + JSON.stringify(json.err));
  }

  return json;
}

class RESTApiClientImpl implements IRequestHandler {
  async startSolution(): Promise<void> {
    const url = K_API_URL + '/exec/start';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{}',
    });
    const _json = await handleError(response);
  }

  async getAllJobs(): Promise<IJob[]> {
    const url = K_API_URL + '/job';
    const response = await fetch(url, {
      method: 'GET',
    });
    const json = await handleError(response);

    return json.body;
  }

  async getJob(jobId: string): Promise<{ job: IJob; tasks: ITask[] } | null> {
    const url = K_API_URL + '/job/' + jobId;
    const response = await fetch(url, {
      method: 'GET',
    });
    const json = await handleError(response);

    return json.body;
  }

  async getAllTestCases(): Promise<ITestCase[]> {
    const url = K_API_URL + '/testcase';
    const response = await fetch(url, {
      method: 'GET',
    });
    const json = await handleError(response);

    return json.body;
  }

  async getAllTestCaseGroups(): Promise<ITestCaseGroup[]> {
    const url = K_API_URL + '/testcasegroup';
    const response = await fetch(url, {
      method: 'GET',
    });
    const json = await handleError(response);

    return json.body;
  }

  async getTestCaseGroup(
    id: string
  ): Promise<{ testCases: ITestCase[] } | null> {
    // TODOL URIEncode
    const url = K_API_URL + '/testcasegroup/' + id;
    const response = await fetch(url, {
      method: 'GET',
    });
    const json = await handleError(response);

    return json.body;
  }

  async createTestCaseGroup(title: string): Promise<ITestCaseGroup> {
    const url = K_API_URL + '/testcasegroup';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: title }),
    });
    const json = await handleError(response);

    return json.body;
  }

  async addTestCasesToTestCaseGroup(
    testCaseGroupId: string,
    testCaseIds: string[]
  ): Promise<void> {
    const url = K_API_URL + '/testcasegroup/' + testCaseGroupId + '/testcase';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ testCaseIds: testCaseIds }),
    });
    const json = await handleError(response);
  }
}

export const RESTApiClient = new RESTApiClientImpl();
