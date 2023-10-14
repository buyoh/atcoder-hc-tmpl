import React from 'react';
import TestCaseList from '../containers/TestCaseList';
import ObserveTestCase from '../containers/ObserveTestCase';
import { RESTApiClient } from '../libs/RESTApiClient';
import ObserveJobList from '../containers/ObserveJobList';
import JobList from '../containers/JobList';
import TaskList from '../containers/TaskList';

// TODO:
async function handleTestRunClick() {
  RESTApiClient.startSolution();
}

export function PageIndex(props: {}): JSX.Element {
  return (
    <>
      <ObserveTestCase />
      <ObserveJobList />
      <div className="column" style={{ height: '100vh' }}>
        <div className="flex-none">
          <h3 className="text-xl font-bold">App</h3>
        </div>
        <div className="flex-auto row overflow-y-hidden">
          <div className="flex-none">
            <h3 className="text-xl font-bold">test run</h3>
            <button
              className="block btn btn-lg btn-primary"
              onClick={handleTestRunClick}
            >
              test run
            </button>
          </div>
          <div className="flex-none overflow-y-scroll">
            <TestCaseList />
          </div>
          <div className="flex-none overflow-y-scroll">
            <JobList />
          </div>
          <div className="flex-none overflow-y-scroll">
            <TaskList />
          </div>
        </div>
      </div>
    </>
  );
}
