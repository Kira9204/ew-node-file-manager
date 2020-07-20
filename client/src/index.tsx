import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'firacode/distr/fira_code.css'
import './index.css';
import { ApplicationState, DispatchAction, initialApplicationState, reducer } from './reducer';

export interface Provider {
  state: ApplicationState,
  dispatch: (obj: DispatchAction) => void
}

const history = createBrowserHistory();
const RootReducerContext = React.createContext<Provider>({state: initialApplicationState, dispatch: () => {} });
export const RootReducerProvider: React.FC<any> = ({
  children
}) => {
  // @ts-ignore
  const [state, dispatch] = React.useReducer(reducer, initialApplicationState);
  const value = {
    state,
    dispatch
  };
  return (
    <RootReducerContext.Provider value={value}>
      {children}
    </RootReducerContext.Provider>
  );
};
export const useRootReducerProvider = () => {
  const context = React.useContext(RootReducerContext);
  if (!context) {
    throw new Error(
      'useRootReducerProvider must be used within a RootReducerProvider'
    );
  }
  return context;
};

ReactDOM.render(
  <Router history={history}>
    <RootReducerProvider>
      <App />
    </RootReducerProvider>
  </Router>,
  document.getElementById('root')
);
