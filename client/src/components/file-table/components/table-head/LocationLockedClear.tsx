import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import {
  getAuthForPath,
  loadPathData,
  LOCATION_LOGIN_KEY,
  StoredAuth
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
  const { state, dispatch } = useRootReducerProvider();

  if (getAuthForPath(history.location.pathname)) {
    return (
      <RemoveIcon
        onClick={() => {
          const path = history.location.pathname;
          const stored = localStorage.getItem(LOCATION_LOGIN_KEY)
            ? localStorage.getItem(LOCATION_LOGIN_KEY)
            : '[]';
          const storedArr: StoredAuth[] = JSON.parse('' + stored);
          const filtered = storedArr.filter((e) => !path.startsWith(e.path));
          localStorage.setItem(LOCATION_LOGIN_KEY, JSON.stringify(filtered));
          loadPathData(state.fsLocation, dispatch);
        }}
      />
    );
  }
  return null;
};

export default LocationLockedClear;
