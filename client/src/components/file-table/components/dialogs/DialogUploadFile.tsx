import * as React from 'react';
import { useRootReducerProvider } from '../../../../index';
import { TableUploadButton } from '../../styles';
import { ACTION_TYPES } from '../../../../reducer';
import { Col, Form, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import axios, { AxiosError } from 'axios';
import { generateUploadURL, loadPathData } from '../../../../service';
import Button from 'react-bootstrap/Button';
import Progressbar from 'react-bootstrap/ProgressBar';

const StyledModal = styled(Modal)`
  &&& .modal-content {
    background-color: #1c2739;
    color: white;
  }
`;

const StyledProgressbar = styled(Progressbar)`
  &&& .progress-bar {
    color: black;
  }
`;

const StyledUploadError = styled.div`
  color: #dc3545;
`;

const UploadButton = styled(Button).attrs({
  variant: 'success',
  size: 'sm',
  type: 'submit'
})`
  margin-left: 42%;
  background: green !important;
`;

const DialogUploadFile: React.FC = () => {
  const { state, dispatch } = useRootReducerProvider();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <>
      <TableUploadButton
        onClick={() => {
          if (!state.uploadDialog.isOpen) {
            dispatch({ type: ACTION_TYPES.OPEN_UPLOAD_DIALOG });
          }
        }}
      >
        Upload
      </TableUploadButton>

      <StyledModal
        show={state.uploadDialog.isOpen}
        onHide={() => {
          dispatch({ type: ACTION_TYPES.CLOSE_UPLOAD_DIALOG });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload file</Modal.Title>
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
            <div className="form-group files">
              <label>Upload Your File </label>
              <input
                type="file"
                className="form-control"
                multiple
                onChange={(event: any) => {
                  dispatch({
                    type: ACTION_TYPES.SET_UPLOAD_DIALOG_FILES,
                    payload: event.target.files
                  });
                }}
              />
            </div>

            <Form.Row>
              <Form.Group as={Col}>
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
              <Form.Group as={Col}>
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
              <Form.Group as={Col}>
                <StyledProgressbar
                  style={{ width: '100%', height: '30px' }}
                  now={state.uploadDialog.uploadPercent}
                  label={state.uploadDialog.uploadPercent + '% uploaded'}
                />
              </Form.Group>
            </Form.Row>

            <UploadButton
              onClick={() => {
                if (!state.uploadDialog.selectedFiles) {
                  return;
                }
                dispatch({
                  type: ACTION_TYPES.SET_UPLOAD_DIALOG_STATUS,
                  payload: {
                    statusCode: 0,
                    statusMessage: ''
                  }
                });

                const config = {
                  auth: {
                    username,
                    password
                  },
                  onUploadProgress: (progressEvent: any) => {
                    const percentCompleted = Math.round(
                      (progressEvent.loaded * 100) / progressEvent.total
                    );
                    dispatch({
                      type: ACTION_TYPES.SET_UPLOAD_DIALOG_PERCENT,
                      payload: percentCompleted
                    });
                  }
                };

                const data = new FormData();
                Object.keys(state.uploadDialog.selectedFiles).forEach((key) => {
                  // @ts-ignore
                  const file = state.uploadDialog.selectedFiles[key];
                  data.append(file.name, file);
                });

                axios
                  .put(generateUploadURL(state.fsLocation), data, config)
                  .then((res) => {
                    setUsername('');
                    setPassword('');
                    loadPathData(state.fsLocation, dispatch);
                    dispatch({
                      type: ACTION_TYPES.CLOSE_UPLOAD_DIALOG
                    });
                  })
                  .catch((err: AxiosError) => {
                    dispatch({
                      type: ACTION_TYPES.SET_UPLOAD_DIALOG_STATUS,
                      payload: {
                        statusCode: err.response ? err.response.status : -1,
                        statusMessage: 'Failed to upload file(s)!'
                      }
                    });
                  });
              }}
            >
              Upload
            </UploadButton>
            {![0, 201].includes(state.uploadDialog.statusCode) && (
              <StyledUploadError>
                {state.uploadDialog.statusMessage}
              </StyledUploadError>
            )}
          </Form>
        </Modal.Body>
      </StyledModal>
    </>
  );
};

export default DialogUploadFile;
