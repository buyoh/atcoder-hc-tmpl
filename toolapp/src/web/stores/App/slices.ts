import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RESTApiClient } from '../../libs/RESTApiClient';

export interface AppState {
  testcases: { path: string; title: string }[];
}

const kInitialAppState: AppState = {
  testcases: [],
};

// ------------------------------------

export const updateHistoryAsync = createAsyncThunk(
  'app/testcase/update',
  async () => {
    console.log('updateHistoryAsync 1');
    const testcases = await RESTApiClient.getAllTestcasesList();
    console.log('updateHistoryAsync 2');
    return {
      testcases,
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
  },
});

// ------------------------------------

export const { resetTestcases } = appSlice.actions;

export const appSliceReducer = appSlice.reducer;
