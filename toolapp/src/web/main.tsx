import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { reduxStore } from './stores/stores';
import { PageIndex } from './pages/Index';
import './style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={reduxStore}>
      <PageIndex />
    </Provider>
  </React.StrictMode>
);
