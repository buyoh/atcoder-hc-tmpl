import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RESTApiClient } from '../../libs/RESTApiClient';
import { IJob, ITask, ITestCase, ITestCaseGroup } from '../../../interface/Web';

export interface AppState {
  testcases: ITestCase[];  // TODO: Rename to testCases
  testCaseGroups: ITestCaseGroup[];
  jobs: IJob[];
  selectedJobId: string | null;
  tasksOfSelectedJobs: ITask[];
}

const kInitialAppState: AppState = {
  testcases: [],
  testCaseGroups: [],
  jobs: [],
  selectedJobId: null,
  tasksOfSelectedJobs: [],
};

// ------------------------------------

// TODO: Rename to load
export const updateTestCasesAsync = createAsyncThunk(
  'app/testcase/Update',
  async () => {
    const testcases = await RESTApiClient.getAllTestCases();
    testcases.sort((l, r) => l.path.localeCompare(r.path));
    return {
      testcases,
    };
  }
);

export const updateTestCaseGroupsAsync = createAsyncThunk(
  'app/testcasegroup/Update',
  async () => {
    const testCaseGroups = await RESTApiClient.getAllTestCaseGroups();
    return {
      testCaseGroups,
    };
  }
);

export const updateJobListAsync = createAsyncThunk(
  'app/job/Update',
  async () => {
    const jobs = await RESTApiClient.getAllJobs();
    return {
      jobs,
    };
  }
);

export const updateTaskListAsync = createAsyncThunk(
  'app/job/task/Update',
  async (tasks: { jobId: string, changeJobId?: boolean }) => {
    const {jobId, changeJobId} = tasks;
    const job = await RESTApiClient.getJob(jobId);
    if (job === null) {
      return {
        jobId,
        tasks: [],
      };
    }
    return {
      jobId,
      changeJobId,
      tasks: job.tasks,
    };
  }
);

// ------------------------------------

const appSlice = createSlice({
  name: 'app',
  initialState: kInitialAppState,

  // --------------

  reducers: {
    resetTestcases(state, action: PayloadAction<void>) {
      state.testcases = [];
    },
  },

  // --------------

  extraReducers(builder) {
    builder.addCase(updateTestCasesAsync.fulfilled, (state, action) => {
      state.testcases = action.payload.testcases;
    });
    builder.addCase(updateTestCaseGroupsAsync.fulfilled, (state, action) => {
      state.testCaseGroups = action.payload.testCaseGroups;
    });
    builder.addCase(updateJobListAsync.fulfilled, (state, action) => {
      state.jobs = action.payload.jobs;
    });
    // TODO: consider Async corner case
    // updateHistoryAsyncなどは常に同じ情報元を読み込む
    // 一方でupdateTaskListAsyncはjobIdによって読み込む情報が変わる
    // 異なるクエリが連続でくると、前のクエリの結果が後のクエリの結果を上書きしてしまう
    builder.addCase(updateTaskListAsync.fulfilled, (state, action) => {
      const { jobId, changeJobId, tasks } = action.payload;
      if (changeJobId || state.selectedJobId === jobId) {
        state.selectedJobId = jobId;
        state.tasksOfSelectedJobs = tasks;
      }
    });
  },
});

// ------------------------------------

export const { resetTestcases } = appSlice.actions;

export const appSliceReducer = appSlice.reducer;
