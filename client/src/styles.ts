import styled from 'styled-components';
import Spinner from 'react-bootstrap/Spinner';

export const ContentTop = styled.div`
  color: #dee2e6;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`;

export const LoadingSpinner = styled(Spinner).attrs({
  animation: 'border',
  variant: 'primary'
})`
  &&& {
    width: 50px;
    height: 50px;
  }
`;

export const LoadingSpinnerText = styled.div`
  padding-top: 10px;
  color: #007bff;
`;

export const LoadingErrorIcon = styled.i.attrs({
  className: 'fas fa-exclamation-triangle'
})`
  font-size: 400%;
  padding-bottom: 10px;
  color: #dc3545;
`;

export const LoadingWarningIcon = styled.i.attrs({
  className: 'fas fa-exclamation-triangle'
})`
  font-size: 400%;
  padding-bottom: 10px;
  color: #ffc107;
`;

export const LinkSpan = styled.span`
  text-decoration: underline;
  color: #007bff;
  cursor: pointer;
`;
