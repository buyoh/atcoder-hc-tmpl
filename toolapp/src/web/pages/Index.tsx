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
    <div className="block flex-none" style={{ height: '100vh' }}>
      <ObserveTestCase />
      <h2 className="text-xl font-bold">App</h2>
      <h3 className="text-xl font-bold">test run</h3>
      <button
        className="block btn btn-lg btn-primary"
        onClick={handleTestRunClick}
      >
        test run
      </button>
      <div>
        <TestCaseList />
      </div>
    </div>
  );
}
