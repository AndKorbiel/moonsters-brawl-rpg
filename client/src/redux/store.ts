import { createStore, applyMiddleware, compose } from 'redux';
import { rootReducer } from './reducers/index';
import { thunk } from 'redux-thunk';

const composeEnhancers =
  (window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as typeof compose) || compose;

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)),
);
