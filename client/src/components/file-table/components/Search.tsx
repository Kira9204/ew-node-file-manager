import React from 'react';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';

interface Props {
  searchContains: string;
  setSearchContains: (str: string) => void;
}

const Container = styled.div`
  display: flex;
  flex: 1 auto;
  align-items: center;
`;

const SearchIcon = styled.i.attrs({
  className: 'fas fa-search'
})`
  font-weight: 900;
  color: green;
  margin-left: 8px;
  margin-right: 16px;
`;

const Search: React.FC<Props> = ({ searchContains, setSearchContains }) => {
  return (
    <Container>
    <SearchIcon />
    <Form.Control
      id="fileStatSearch"
      type="text"
      placeholder="Search contains..."
      value={searchContains}
      onChange={(e: any) => {
        setSearchContains(e.target.value);
      }}
      style={{
        height: '28px',
        marginTop: '4px'
      }}
    />
    </Container>
  );
};

export default Search;
