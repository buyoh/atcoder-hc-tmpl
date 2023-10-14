import React from 'react';
import TestCaseList from '../containers/TestCaseList';
import ObserveTestCase from '../containers/ObserveTestCase';
import { RESTApiClient } from '../libs/RESTApiClient';

const K_API_URL = ((import.meta as any).env.VITE_API_URL || '') as string;

// TODO:
async function handleTestRunClick() {
  RESTApiClient.startSolution();
}

export function PageIndex(props: {}): JSX.Element {
  return (
    <>
      <ObserveTestCase />
      <div className="column" style={{ height: '100vh' }}>
        <div className="flex-none">
          <h3 className="text-xl font-bold">App</h3>
        </div>
        <div className="flex-auto row overflow-hidden">
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
        </div>
      </div>
    </>
  );
}
