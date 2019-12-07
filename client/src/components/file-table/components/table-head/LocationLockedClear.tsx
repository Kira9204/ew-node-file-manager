import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import {
  getAuthForPath,
  loadPathData,
  removeAuthForLocation
} from '../../../../service';
import { useRootReducerProvider } from '../../../../index';

export const RemoveIcon = styled.i.attrs({
  className: 'fas fa-times'
})`
  color: #dc3545;
  cursor: pointer;
`;

const LocationLockedClear: React.FC = () => {
  const history = useHistory();
  const { dispatch } = useRootReducerProvider();

  if (getAuthForPath(history.location.pathname)) {
    return (
      <RemoveIcon
        onClick={() => {
          removeAuthForLocation(history.location.pathname);
          loadPathData(history.location.pathname, dispatch);
        }}
      />
    );
  }
  return null;
};

export default LocationLockedClear;
