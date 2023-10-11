import { IRequestHandler } from '../../interface/Web';

const K_API_URL = ((import.meta as any).env.VITE_API_URL || '') as string;

class RESTApiClientImpl implements IRequestHandler {
  async getAllTestcasesList(): Promise<{ path: string; title: string }[]> {
    const url = K_API_URL + '/testcase';
    const response = await fetch(url, {
      method: 'GET',
    });

    if (response.status !== 200) {
      console.warn('HTTP Error: ' + response.status);
      throw new Error('HTTP Error: ' + response.status);
    }

    const json = await response.json();

    if (json.err !== null) {
      console.warn('API Error: ' + JSON.stringify(json.err));
      throw new Error('API Error: ' + JSON.stringify(json.err));
    }

    // TODO: validate
    return json.body;
  }
}

export const RESTApiClient = new RESTApiClientImpl();
