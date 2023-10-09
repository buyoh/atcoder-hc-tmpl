import React from 'react';

const K_API_URL = ((import.meta as any).env.VITE_API_URL || '') as string;

async function handleTestRunClick() {
  const url = K_API_URL + '/exec/start';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: '{}',
  });
}

export function PageIndex(props: {}): JSX.Element {
  return (
    <div className="block flex-none" style={{ height: '100vh' }}>
      <h2 className='text-xl font-bold'>App</h2>
      <h3 className='text-xl font-bold'>test run</h3>
      <button className='block btn btn-lg btn-primary' onClick={handleTestRunClick}>test run</button>
    </div>
  );
}
