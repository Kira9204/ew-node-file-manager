import * as React from 'react';
import { useRootReducerProvider } from '../../../../index';
import { ACTION_TYPES } from '../../../../reducer';
import { Col, Form, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import axios, { AxiosError } from 'axios';
import { generateDeleteURL, loadPathData } from '../../../../service';
import Button from 'react-bootstrap/Button';

const StyledModal = styled(Modal)`
  &&& .modal-content {
    background-color: #1c2739;
    color: white;
  }
`;

const TableSelectedDeleteButton = styled(Button).attrs({
  variant: 'danger',
  size: 'sm'
})`
  background: #dc3545 !important;
  border-color: #dc3545 !important;
  margin-left: 10px;
`;

const DeleteButton = styled(Button).attrs({
  variant: 'danger',
  size: 'sm'
})`
  margin-left: 42%;
`;

const StyledDeleteError = styled.div`
  color: #dc3545;
`;

const DialogDeleteFile: React.FC<{
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
}> = ({ selectedFiles, setSelectedFiles }) => {
  const { state, dispatch } = useRootReducerProvider();
  const userName = state.deleteDialog.userName;
  const password = state.deleteDialog.password;

  return (
    <>
      <TableSelectedDeleteButton
        onClick={() => {
          if (!state.deleteDialog.isOpen && selectedFiles.length > 0) {
            dispatch({ type: ACTION_TYPES.OPEN_DELETE_DIALOG });
          }
        }}
      >
        Delete
        {selectedFiles.length > 0 ? ` (${selectedFiles.length})` : ''}
      </TableSelectedDeleteButton>

      <StyledModal
        show={state.deleteDialog.isOpen}
        onHide={() => {
          dispatch({ type: ACTION_TYPES.CLOSE_DELETE_DIALOG });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            method="post"
            action="#"
            id="#"
            onSubmit={(e: any) => {
              e.preventDefault();
              return false;
            }}
          >
            <Form.Row>
              <p>You are about to remove the following files:</p>
              <ul>
                {selectedFiles.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
              <p>Provide a username and password to continue</p>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Control
                  id="loginUsername"
                  type="text"
                  placeholder="Username"
                  value={userName}
                  onChange={(e: any) => {
                    dispatch({
                      type: ACTION_TYPES.SET_DELETE_DIALOG_USERNAME,
                      payload: e.target.value
                    });
                  }}
                  isInvalid={userName.length === 0}
                  isValid={userName.length > 0}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Control
                  id="loginPassword"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e: any) => {
                    dispatch({
                      type: ACTION_TYPES.SET_DELETE_DIALOG_PASSWORD,
                      payload: e.target.value
                    });
                  }}
                  isInvalid={password.length === 0}
                  isValid={password.length > 0}
                />
              </Form.Group>
            </Form.Row>

            <DeleteButton
              onClick={() => {
                if (userName.length === 0 || password.length === 0) {
                  return;
                }
                axios
                  .delete(generateDeleteURL(state.fsLocation, selectedFiles), {
                    auth: {
                      username: userName,
                      password
                    }
                  })
                  .then((res) => {
                    loadPathData(state.fsLocation, dispatch);
                    dispatch({
                      type: ACTION_TYPES.CLOSE_DELETE_DIALOG
                    });
                    setSelectedFiles([]);
                  })
                  .catch((err: AxiosError) => {
                    dispatch({
                      type: ACTION_TYPES.SET_DELETE_DIALOG_ERROR,
                      payload: {
                        statusCode: err.response ? err.response.status : -1,
                        statusMessage: 'Could not delete file(s)!'
                      }
                    });
                  });
              }}
            >
              Delete
            </DeleteButton>
            {![0, 200].includes(state.deleteDialog.statusCode) && (
              <StyledDeleteError>
                {state.deleteDialog.statusMessage}
              </StyledDeleteError>
            )}
          </Form>
        </Modal.Body>
      </StyledModal>
    </>
  );
};

export default DialogDeleteFile;
