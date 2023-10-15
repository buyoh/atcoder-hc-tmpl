import { Express } from 'express';
import { IRequestHandler } from '../../interface/Web';

export async function applyRESTMiddleWare(
  app: Express,
  requestHandler: IRequestHandler
): Promise<void> {
  app.get('/api', (req, res) => {
    res.json({ message: 'Hello from server!' });
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

  app.get('/api/job', async (req, res, next) => {
    try {
      const jobs = await requestHandler.getAllJobs();
      res.statusCode = 200;
      res.json({ err: null, body: jobs });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/job/:jobId', async (req, res, next) => {
    try {
      const jobId = req.params.jobId;
      const job = await requestHandler.getJob(jobId);
      res.statusCode = 200; // return 200 even if job is not found
      res.json({ err: null, body: job });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/testcase', async (req, res, next) => {
    try {
      const testCases = await requestHandler.getAllTestCases();
      res.statusCode = 200;
      res.json({ err: null, body: testCases });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/testcasegroup', async (req, res, next) => {
    try {
      const testCaseGroups = await requestHandler.getAllTestCaseGroups();
      res.statusCode = 200;
      res.json({ err: null, body: testCaseGroups });
    } catch (error) {
      next(error);
    }
  });


  app.get('/api/testcasegroup/:groupId', async (req, res, next) => {
    try {
      const testCaseId = req.params.groupId;
      const testCaseGroup = await requestHandler.getTestCaseGroup(testCaseId);
      res.statusCode = 200;
      res.json({ err: null, body: testCaseGroup });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/testcasegroup', async (req, res, next) => {
    try {
      const title = req.body.title;
      const testCaseGroup = await requestHandler.createTestCaseGroup(title);
      res.statusCode = 200;
      res.json({ err: null, body: testCaseGroup });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/testcasegroup/:groupId/testcase', async (req, res, next) => {
    try {
      const groupId = req.params.groupId;
      // TODO: validate
      const testCaseIds = req.body.testCaseIds as string[];
      const testcaseGroup = await requestHandler.addTestCasesToTestCaseGroup(
        groupId,
        testCaseIds
      );
      res.statusCode = 200;
      res.json({ err: null, body: testcaseGroup });
    } catch (error) {
      next(error);
    }
  });
}
