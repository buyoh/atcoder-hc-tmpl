import {
  Job,
  Task,
  TaskState,
  TaskStatus,
  TestCase,
  TestCaseGroup,
} from '../libs/JobTask';
import { DatabaseService } from '../services/DatabaseService';
import { DataSource } from 'typeorm';
import { Job as EJob, Task as ETask } from './entity/JobTask';
import {
  TestCase as ETestCase,
  TestCaseGroup as ETestCaseGroup,
  TestCaseGroupTestCase as TestCaseGroupTestCase,
} from './entity/TestCase';

export class DatabaseServiceTypeorm implements DatabaseService {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async initialize(): Promise<void> {
    await this.dataSource.initialize();
  }

  async createJobAndTasks(fileList: string[]): Promise<Job> {
    if (!this.dataSource.isInitialized) {
      throw new Error('DatabaseServiceTypeorm is not initialized');
    }
    try {
      const jobRepo = this.dataSource.getRepository(EJob);
      const taskRepo = this.dataSource.getRepository(ETask);

      const ret = await this.dataSource.transaction(
        async (transactionalEntityManager) => {
          const job = await jobRepo.save({});
          await taskRepo.save(
            fileList.map((file) => ({
              jobId: job.id,
              inputFilePath: file,
              status: 'pending',
              exitCode: -1,
              score: 0,
            }))
          );
          return job;
        }
      );

      if (ret === undefined) {
        throw new Error('transaction failed');
      }
      return { id: ret.id, createdAt: ret.createdAt };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getAllJobs(): Promise<Job[]> {
    if (!this.dataSource.isInitialized) {
      throw new Error('DatabaseServiceTypeorm is not initialized');
    }
    try {
      const jobRepo = this.dataSource.getRepository(EJob);
      return (await jobRepo.find()).map((job) => ({
        id: job.id,
        createdAt: job.createdAt,
      }));
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getJob(
    jobId: string
  ): Promise<{ job: Job; tasks: (Task & TaskState)[] } | null> {
    if (!this.dataSource.isInitialized) {
      throw new Error('DatabaseServiceTypeorm is not initialized');
    }
    try {
      const jobRepo = this.dataSource.getRepository(EJob);
      const taskRepo = this.dataSource.getRepository(ETask);

      const ret = await this.dataSource.transaction(
        async (transactionalEntityManager) => {
          const job = await jobRepo.findOne({ where: { id: jobId } });
          if (!job) {
            return null;
          }
          const tasks = await taskRepo.find({ where: { jobId: jobId } });

          return {
            job: {
              id: job.id,
              createdAt: job.createdAt,
            },
            tasks: tasks.map((task) => ({
              id: task.id,
              inputFilePath: task.inputFilePath,
              status: task.status as TaskStatus, // TODO: Validate
              exitCode: task.exitCode,
              score: task.score,
              error: null,
            })),
          };
        }
      );
      if (ret === undefined) {
        throw new Error('transaction failed');
      }
      return ret;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async updateTaskState(taskId: string, state: TaskState): Promise<boolean> {
    if (!this.dataSource.isInitialized) {
      throw new Error('DatabaseServiceTypeorm is not initialized');
    }
    try {
      const taskRepo = this.dataSource.getRepository(ETask);

      const res = await taskRepo.update(
        { id: taskId },
        {
          status: state.status,
          exitCode: state.exitCode || -1,
          score: state.score,
        }
      );

      if (res.affected === undefined) {
        // the driver is not supported. always return true.
        return true;
      }
      return res.affected > 0;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async createTestCaseGroup(title: string): Promise<TestCaseGroup> {
    if (!this.dataSource.isInitialized) {
      throw new Error('DatabaseServiceTypeorm is not initialized');
    }

    const testCaseGroupRepo = this.dataSource.getRepository(ETestCaseGroup);
    try {
      const testCaseGroup = await testCaseGroupRepo.save({
        title: title,
        type: 0,
      });
      return { id: testCaseGroup.id, title: testCaseGroup.title, type: 0 };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async addTestCasesToTestCaseGroup(
    testCaseGroupId: string,
    testCaseIds: string[]
  ): Promise<void> {
    if (!this.dataSource.isInitialized) {
      throw new Error('DatabaseServiceTypeorm is not initialized');
    }

    testCaseIds = [...new Set(testCaseIds)]; // remove duplicates

    const testCaseGroupTestCaseRepo = this.dataSource.getRepository(
      TestCaseGroupTestCase
    );
    try {
      await this.dataSource.transaction(async (transactionalEntityManager) => {
        const promises = testCaseIds.map((testCaseId) =>
          testCaseGroupTestCaseRepo.save({
            testCaseGroupId: testCaseGroupId,
            testCaseId: testCaseId,
          })
        );
        await Promise.all(promises);
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getAllTestCaseGroups(): Promise<TestCaseGroup[]> {
    if (!this.dataSource.isInitialized) {
      throw new Error('DatabaseServiceTypeorm is not initialized');
    }
    const testCaseGroupRepo = this.dataSource.getRepository(ETestCaseGroup);
    try {
      return (await testCaseGroupRepo.find()).map((testCaseGroup) => ({
        id: testCaseGroup.id,
        title: testCaseGroup.title,
        type: testCaseGroup.type,
      }));
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getTestCaseGroup(
    id: string
  ): Promise<{ testCases: TestCase[] } | null> {
    if (!this.dataSource.isInitialized) {
      throw new Error('DatabaseServiceTypeorm is not initialized');
    }
    const testCaseGroupRepo = this.dataSource.getRepository(ETestCaseGroup);
    const testCaseRepo = this.dataSource.getRepository(ETestCase);
    try {
      const ret = await this.dataSource.transaction(
        async (transactionalEntityManager) => {
          const testCaseGroup = await testCaseGroupRepo.findOne({
            where: { id: id },
          });
          if (!testCaseGroup) {
            return null;
          }
          const testCases = await testCaseRepo
            .createQueryBuilder('testCase')
            .innerJoin(
              'testCase.testCaseGroupTestCases',
              'testCaseGroupTestCase',
              'testCaseGroupTestCase.testCaseGroupId = :testCaseGroupId',
              { testCaseGroupId: id }
            )
            .getMany();

          return {
            testCases: testCases.map((testCase) => ({
              id: testCase.id,
              filePath: testCase.filePath,
              available: testCase.available,
            })),
          };
        }
      );
      if (ret === undefined) {
        throw new Error('transaction failed');
      }
      return ret;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getAllTestCase(): Promise<TestCase[]> {
    // TODO: Use testCase.available
    if (!this.dataSource.isInitialized) {
      throw new Error('DatabaseServiceTypeorm is not initialized');
    }
    const testCaseRepo = this.dataSource.getRepository(ETestCase);
    try {
      return (await testCaseRepo.find()).map((testCase) => ({
        id: testCase.id,
        filePath: testCase.filePath,
        available: testCase.available,
      }));
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async syncTestCases(filePaths: string[]): Promise<void> {
    if (!this.dataSource.isInitialized) {
      throw new Error('DatabaseServiceTypeorm is not initialized');
    }
    const testCaseRepo = this.dataSource.getRepository(ETestCase);
    try {
      await this.dataSource.transaction(async (transactionalEntityManager) => {
        // TODO: 足りない分を挿入するだけ
        const existingTestCases = await testCaseRepo.find();
        const existingFilePaths = new Set(
          existingTestCases.map((testCase) => testCase.filePath)
        );

        const newFilePaths = filePaths.filter(
          (filePath) => !existingFilePaths.has(filePath)
        );
        console.log(
          'syncTestCases: adding new test cases: ',
          newFilePaths.length
        );
        const newTestCases = newFilePaths.map((filePath) => ({
          filePath: filePath,
          available: true,
        }));
        await testCaseRepo.save(newTestCases);
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
