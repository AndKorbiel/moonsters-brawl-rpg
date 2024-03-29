import React from 'react';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './styles/index.css';

import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
