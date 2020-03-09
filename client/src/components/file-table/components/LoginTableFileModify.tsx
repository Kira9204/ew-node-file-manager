import React from 'react';
import styled from 'styled-components';
import Table from 'react-bootstrap/Table';
import { Form } from 'react-bootstrap';
import { ACTION_TYPES } from '../../../reducer';
import Button from 'react-bootstrap/Button';
import {
    authModifyTestAndStoreNew,
    getAuthForPath,
    loadPathData,
    removeAuthForLocation,
    StoredAuth,
} from '../../../service';
import { useRootReducerProvider } from '../../../index';
import { LOCATION_LOGIN_MODIFY_KEY } from '../../../constants';

const LoginEl = styled(Table).attrs({
  variant: 'dark',
  bordered: false
})`
  margin-left: auto;
  margin-right: auto;
  max-width: 60%;
  &&& {
    color: #dee2e6;
  }
`;

const LogoutEl = styled.div`
  margin-left: auto;
  margin-right: auto;
`;

const LoginButton = styled(Button).attrs({
  variant: 'success',
  size: 'sm'
})`
  background: green !important;
  border-color: green !important;
  margin-left: auto;
  margin-right: auto;
`;

const LogoutButton = styled(Button).attrs({
  variant: 'danger',
  size: 'sm'
})`
  margin-left: 42%;
`;

const StyledError = styled.span`
  color: #dc3545;
`;

const LoginForm: React.FC = () => {
  const { state, dispatch } = useRootReducerProvider();
  const location = state.fsLocation;
  const { username, password } = state.loginModifyTest;

  return (
    <LoginEl>
      <thead></thead>
      <tbody>
        <tr>
          <td>
            <Form.Control
              data-lpignore="true"
              id="usernameInput"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e: any) => {
                dispatch({
                  type: ACTION_TYPES.SET_TEST_MODIFY_AUTH_USERNAME,
                  payload: e.target.value
                });
              }}
            />
          </td>
          <td>
            <Form.Control
              data-lpignore="true"
              id="passwordInputName"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: any) => {
                dispatch({
                  type: ACTION_TYPES.SET_TEST_MODIFY_AUTH_PASSWORD,
                  payload: e.target.value
                });
              }}
            />
          </td>
          <td>
            <LoginButton
              onClick={() => {
                  authModifyTestAndStoreNew(location, username, password, dispatch);
              }}
            >
              Login
            </LoginButton>
              {state.loginModifyTest.showLoginError && (
                  <StyledError> Invalid login</StyledError>
              )}
          </td>
        </tr>
      <tr>
          <td>
              Notice: logins are valid per-location downwards
          </td>
          <td></td>
          <td></td>
      </tr>
      </tbody>
    </LoginEl>
  );
};

const LogoutForm: React.FC<{ auth: StoredAuth }> = ({ auth }) => {
  const { state, dispatch } = useRootReducerProvider();
  const location = state.fsLocation;

  const credentials = Buffer.from(auth.auth, 'base64').toString('utf8');
  const [username] = credentials.split(':');
  return (
    <LogoutEl>
      <LogoutButton
        onClick={() => {
          removeAuthForLocation(
            auth.location,
            false,
            LOCATION_LOGIN_MODIFY_KEY
          );
          loadPathData(location, dispatch);
        }}
      >
        Logout {username}
      </LogoutButton>
    </LogoutEl>
  );
};

const LoginTableFileModify: React.FC = () => {
  const { state, dispatch } = useRootReducerProvider();
  const location = state.fsLocation;
  const foundLogin = getAuthForPath(location, false, LOCATION_LOGIN_MODIFY_KEY);

  if (foundLogin) {
    return <LogoutForm auth={foundLogin} />;
  }
  return <LoginForm />;
};

export default LoginTableFileModify;
