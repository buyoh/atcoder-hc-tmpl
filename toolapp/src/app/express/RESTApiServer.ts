import { Express } from 'express';
import { IRequestHandler } from '../../interface/Web';

export async function applyRESTMiddleWare(
  app: Express,
  requestHandler: IRequestHandler
): Promise<void> {
  app.get('/api', (req, res) => {
    res.json({ message: 'Hello from server!' });
  });

  app.get('/api/testcase', async (req, res, next) => {
    try {
      const testcases = await requestHandler.getAllTestcasesList();
      res.statusCode = 200;
      res.json({ err: null, body: testcases });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/exec/start', async (req, res, next) => {
    try {
      // noawait
      requestHandler.startSolution();
      res.json({ err: null });
    } catch (error) {
      next(error);
    }
  });
}