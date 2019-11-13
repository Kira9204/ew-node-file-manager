import React from "react";
import styled from "styled-components";
import {SORT_BY} from "../../utils";

export const SortNameInactive = styled.span`
  &:hover {
    color: green;
    text-decoration: underline;
    cursor: pointer;
  }
`;
export const SortNameActive = styled.span`
  text-decoration: underline;
  font-weight: bold;
  color: green;
  cursor: pointer;
`;


const TableHeadSortDirectionName: React.FC<{
  currentSort: string;
  setCurrentSort: (str: string) => void;
}> = ({ currentSort, setCurrentSort }) => {
  return (
    <>
      {currentSort === SORT_BY.NAME_ASC && (
        <>
          <SortNameActive>Asc</SortNameActive>&nbsp;/&nbsp;
        </>
      )}
      {currentSort !== SORT_BY.NAME_ASC && (
        <>
          <SortNameInactive onClick={() => setCurrentSort(SORT_BY.NAME_ASC)}>
            Asc
          </SortNameInactive>
          &nbsp;/&nbsp;
        </>
      )}
      {currentSort === SORT_BY.NAME_DESC && (
        <SortNameActive>Desc</SortNameActive>
      )}
      {currentSort !== SORT_BY.NAME_DESC && (
        <SortNameInactive
          onClick={() => setCurrentSort(SORT_BY.NAME_DESC)}
        >
          Desc
        </SortNameInactive>
      )}
    </>
  );
};

export default TableHeadSortDirectionName;
