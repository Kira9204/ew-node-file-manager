import React from 'react';
import styled from 'styled-components';
import { Col, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { ApplicationState, DispatchAction } from '../reducer';
import { useHistory } from 'react-router';
import { ContentTop, LoginIcon } from '../styles';
import * as service from '../service';
import { SETTING_CHECK_PASS_GLOBAL, TITLE_STR } from '../constants';
import AuthorText from './AuthorText';

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

const ListLoginPage: React.FC<{
  state: ApplicationState;
  dispatch: (obj: DispatchAction) => void;
}> = ({ dispatch }) => {
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
          if (username.length !== 0 && password.length !== 0) {
            service.authStoreNew(
              isStoreAsGlobal ? '/' : history.location.pathname,
              username,
              password
            );
            service.loadPathData(history.location.pathname, dispatch);
            setTimeout(() => {
              setHasTriedLogin(true);
            }, 500);
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
              data-lpignore="true"
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
              data-lpignore="true"
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
              onClick={() => {
                setIsStoreAsGlobal(!isStoreAsGlobal);
              }}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <LoginButton>Login</LoginButton>
        </Form.Row>
      </Form>
      {hasTriedLogin && <StyledError>Invalid login for path!</StyledError>}
      <AuthorText marginTop="30px" />
    </ContentTop>
  );
};

export default ListLoginPage;
