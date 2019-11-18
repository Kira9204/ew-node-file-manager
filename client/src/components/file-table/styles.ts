import styled from 'styled-components';
import StrapTable from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

export const CenterDiv = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 90%;
`;
export const Table = styled(StrapTable).attrs({
  variant: 'dark',
  bordered: true,
  striped: true,
  hover: true
})`
  margin-left: auto;
  margin-right: auto;
  max-width: 90%;
  &&& {
    color: #dee2e6;
  }
`;

export const TableRow = styled.tr`
  font-size: 100%;
`;

export const TableColKind = styled.td`
  color: #fd7e14;
  vertical-align: middle;
  &&& {
    padding-top: 17px;
  }
`;

export const TableColSize = styled.td`
  color: #ffc107;
  vertical-align: middle;
  &&& {
    padding-top: 17px;
  }
`;

export const TableColModified = styled.td`
  color: #a78adc
    vertical-align: middle;
  &&& {
      padding-top: 17px;
  }
`;

export const Link = styled.a`
  color: inherit;
  text-decoration: none;
  &:hover {
    color: inherit;
    text-decoration: underline;
    color: green;
  }
`;

export const LinkWhite = styled.a`
  color: inherit;
  text-decoration: none;
  &:hover {
    color: inherit;
    text-decoration: underline;
    color: white;
  }
`;

export const LinkSpan = styled.span`
  color: inherit;
  text-decoration: none;
  &:hover {
    color: inherit;
    text-decoration: underline;
    color: green;
  }
  cursor: pointer;
`;

export const TableHeadArrowUpIcon = styled.i`
  vertical-align: middle;
  font-size: 150%;
  margin-left: 5px;
  color: green;
  cursor: pointer;
`;

export const TableColName = styled.td`
  vertical-align: middle;
`;
export const TableColNameIcon = styled.i`
  vertical-align: middle;
  font-size: 200%;
  margin-right: 10px;
  color: green;
`;

export const TableColNameAlign = styled.span`
  vertical-align: sub;
`;

export const TableSelectedDownloadButton = styled(Button).attrs({
  variant: 'success',
  size: 'sm'
})`
  background: green !important;
  border-color: green !important;
`;

export const TableUploadButton = styled(Button).attrs({
  variant: 'success',
  size: 'sm'
})`
  background: #a78adc !important;
  border-color: #a78adc !important;
  margin-left: 10px;
`;
