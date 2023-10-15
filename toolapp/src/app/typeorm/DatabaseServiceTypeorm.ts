import { Job, Task, TaskState, TaskStatus } from '../libs/JobTask';
import { DatabaseService } from '../services/DatabaseService';
import { DataSource } from 'typeorm';
import { Job as EJob, Task as ETask } from './entity/JobTask';

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
          const promises = fileList.map((file) =>
            taskRepo.save({
              jobId: job.id,
              inputFilePath: file,
              status: 'pending',
              exitCode: -1,
              score: 0,
            })
          );
          await Promise.all(promises);
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
      return (await jobRepo.find()).map((job) => ({ id: job.id, createdAt: job.createdAt }));
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
}
