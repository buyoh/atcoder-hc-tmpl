import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RESTApiClient } from '../../libs/RESTApiClient';
import { IJob, ITask } from '../../../interface/Web';

export interface AppState {
  testcases: { path: string; title: string }[];
  jobs: IJob[];
  selectedJobId: string | null;
  tasksOfSelectedJobs: ITask[];
}

const kInitialAppState: AppState = {
  testcases: [],
  jobs: [],
  selectedJobId: null,
  tasksOfSelectedJobs: [],
};

// ------------------------------------

export const updateHistoryAsync = createAsyncThunk(
  'app/testcase/Update',
  async () => {
    const testcases = await RESTApiClient.getAllTestcasesList();
    return {
      testcases,
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
  async (jobId: string) => {
    const job = await RESTApiClient.getJob(jobId);
    if (job === null) {
      return {
        jobId,
        tasks: [],
      };
    }
    return {
      jobId,
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
    builder.addCase(updateHistoryAsync.fulfilled, (state, action) => {
      state.testcases = action.payload.testcases;
    });
    builder.addCase(updateJobListAsync.fulfilled, (state, action) => {
      state.jobs = action.payload.jobs;
    });
    // TODO: consider Async corner case
    // updateHistoryAsyncなどは常に同じ情報元を読み込む
    // 一方でupdateTaskListAsyncはjobIdによって読み込む情報が変わる
    // 異なるクエリが連続でくると、前のクエリの結果が後のクエリの結果を上書きしてしまう
    builder.addCase(updateTaskListAsync.fulfilled, (state, action) => {
      state.selectedJobId = action.payload.jobId;
      state.tasksOfSelectedJobs = action.payload.tasks;
    });
  },
});

// ------------------------------------

export const { resetTestcases } = appSlice.actions;

export const appSliceReducer = appSlice.reducer;
