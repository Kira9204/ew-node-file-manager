import React from "react";
import { useHistory } from "react-router"
import styled from 'styled-components';
import { getAuthForPath } from "../../../../service";

export const LoginIcon = styled.i.attrs({
  className: 'fas fa-key'
})`
  color: #ffc107;
`;

const LocationLocked: React.FC = () => {
  const history = useHistory();
  if (getAuthForPath(history.location.pathname)) {
    return (
      <LoginIcon />
    );
  }
  return null;
};

export default LocationLocked
