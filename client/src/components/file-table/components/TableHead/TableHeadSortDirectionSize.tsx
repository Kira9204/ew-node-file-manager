import React from "react";
import styled from "styled-components";
import {SORT_BY} from "../../utils";

export const SortItemSizeActive = styled.span`
  text-decoration: underline;
  font-weight: bold;
  color: #ffc107;
  cursor: pointer;
`;

export const SortItemSizeInactive = styled.span`
  &:hover {
    color: #ffc107;
    text-decoration: underline;
    cursor: pointer;
  }
`;

const TableHeadSortDirectionSize: React.FC<{
  currentSort: string;
  setCurrentSort: (str: string) => void;
}> = ({ currentSort, setCurrentSort }) => {
  return (
    <>
      {currentSort === SORT_BY.SIZE_ASC && (
        <>
          <SortItemSizeActive>Asc</SortItemSizeActive>&nbsp;/&nbsp;
        </>
      )}
      {currentSort !== SORT_BY.SIZE_ASC && (
        <>
          <SortItemSizeInactive
            onClick={() => setCurrentSort(SORT_BY.SIZE_ASC)}
          >
            Asc
          </SortItemSizeInactive>
          &nbsp;/&nbsp;
        </>
      )}
      {currentSort === SORT_BY.SIZE_DESC && (
        <SortItemSizeActive>Desc</SortItemSizeActive>
      )}
      {currentSort !== SORT_BY.SIZE_DESC && (
        <SortItemSizeInactive onClick={() => setCurrentSort(SORT_BY.SIZE_DESC)}>
          Desc
        </SortItemSizeInactive>
      )}
    </>
  );
};

export default TableHeadSortDirectionSize;
