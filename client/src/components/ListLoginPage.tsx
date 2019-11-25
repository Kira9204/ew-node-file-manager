import React from 'react';
import styled from 'styled-components';
import { Col, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { ApplicationState, DispatchAction } from '../reducer';
import { useHistory } from 'react-router';
import { ContentTop, LoginIcon } from '../styles';
import { loadPathData, StoredAuth } from '../service';
import {
  LOCATION_LOGIN_KEY,
  SETTING_CHECK_PASS_GLOBAL,
  TITLE_STR
} from '../constants';

export const LoginButton = styled(Button).attrs({
  variant: 'success',
  size: 'sm',
  type: 'submit'
})`
  background: green !important;
  margin: 0 auto !important;
`;

const StyledError = styled.div`
  color: #dc3545;
`;

const addUserPasswordForPath = (
  path: string,
  username: string,
  password: string,
  dispatch: (obj: DispatchAction) => void
) => {
  const stored = localStorage.getItem(LOCATION_LOGIN_KEY)
    ? localStorage.getItem(LOCATION_LOGIN_KEY)
    : '[]';
  const storedArr: StoredAuth[] = JSON.parse('' + stored);

  for (let i = 0; i < storedArr.length; i++) {
    if (path.startsWith(storedArr[i].path)) {
      storedArr[i].username = username;
      storedArr[i].password = password;
      localStorage.setItem(LOCATION_LOGIN_KEY, JSON.stringify(storedArr));
      loadPathData(path, dispatch);
      return;
    }
  }

  storedArr.push({
    path,
    username,
    password
  });
  localStorage.setItem(LOCATION_LOGIN_KEY, JSON.stringify(storedArr));
  loadPathData(path, dispatch);
};

const ListLoginPage: React.FC<{
  state: ApplicationState;
  dispatch: (obj: DispatchAction) => void;
}> = ({ state, dispatch }) => {
  const history = useHistory();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isStoreAsGlobal, setIsStoreAsGlobal] = React.useState(
    SETTING_CHECK_PASS_GLOBAL
  );
  const [hasTriedLogin, setHasTriedLogin] = React.useState(false);

  return (
    <ContentTop>
      <h2>{TITLE_STR}</h2>
      <p>A private store for various files</p>
      <LoginIcon />
      <p>This folder is protected by a username and password</p>
      Location: {history.location.pathname}
      <Form
        style={{ width: '20%', margin: '0 auto' }}
        onSubmit={(e: any) => {
          e.preventDefault();
          const usernameEl = document.getElementById('loginUsername');
          const passwordEl = document.getElementById('loginPassword');
          if (usernameEl && passwordEl) {
            // @ts-ignore
            addUserPasswordForPath(
              history.location.pathname,
              // @ts-ignore
              usernameEl.value,
              // @ts-ignore
              passwordEl.value,
              dispatch
            );
          }
          return false;
        }}
      >
        <Form.Row>
          <Form.Group as={Col} controlId="formGridUsername">
            <Form.Control
              id="loginUsername"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e: any) => {
                setUsername(e.target.value);
              }}
              isInvalid={username.length === 0}
              isValid={username.length > 0}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Control
              id="loginPassword"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: any) => {
                setPassword(e.target.value);
              }}
              isInvalid={password.length === 0}
              isValid={password.length > 0}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="useForEverRequestCheckbox">
            <Form.Check
              type="checkbox"
              label="Store as global login (/)"
              style={{ zoom: '1.2' }}
              checked={isStoreAsGlobal}
              onClick={() => setIsStoreAsGlobal(!isStoreAsGlobal)}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <LoginButton
            onClick={() => {
              addUserPasswordForPath(
                isStoreAsGlobal ? '/' : history.location.pathname,
                username,
                password,
                dispatch
              );
              setTimeout(() => {
                setHasTriedLogin(true);
              }, 500);
            }}
          >
            Login
          </LoginButton>
        </Form.Row>
      </Form>
      {hasTriedLogin && (
        <StyledError>Invalid login for path!</StyledError>
      )}
    </ContentTop>
  );
};

export default ListLoginPage;
