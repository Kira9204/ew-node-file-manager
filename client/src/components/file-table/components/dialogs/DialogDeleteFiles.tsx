import * as React from 'react';
import { useRootReducerProvider } from '../../../../index';
import { ACTION_TYPES } from '../../../../reducer';
import { Col, Form, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import axios, { AxiosError } from 'axios';
import {generateDeleteURL, getAuthForPath, loadPathData} from '../../../../service';
import Button from 'react-bootstrap/Button';
import {LOCATION_LOGIN_MODIFY_KEY} from "../../../../constants";

const StyledModal = styled(Modal)`
  &&& {
    .modal-content {
        background-color: #1c2739;
        color: white;
    }
    .close {
        color: white;
        opacity: 1;
    }
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
  setSelectedFiles: (files: string[]) => void;
}> = ({ setSelectedFiles }) => {
  const { state, dispatch } = useRootReducerProvider();
  const selectedFiles = state.fileTable.selectedFiles;
  const location = state.fsLocation;

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
            </Form.Row>
            <Form.Row>
              <ul>
                {selectedFiles.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </Form.Row>
            <Form.Row>
              <p>Proceed by confirming this request</p>
            </Form.Row>
            <DeleteButton
              onClick={() => {
                  const foundModifyAuth = getAuthForPath(location, false, LOCATION_LOGIN_MODIFY_KEY);
                  if (!foundModifyAuth) {
                      return;
                  }
                axios
                  .delete(generateDeleteURL(state.fsLocation, selectedFiles), {
                      headers: {
                          Authorization: 'Basic ' + foundModifyAuth.auth
                      },
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
