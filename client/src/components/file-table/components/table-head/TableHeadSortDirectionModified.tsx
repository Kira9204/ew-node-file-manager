import React from "react";
import styled from "styled-components";
import {SORT_BY} from "../../utils";

export const SortItemModifiedInactive = styled.span`
  &:hover {
    color: #a78adc
    text-decoration: underline;
    cursor: pointer;
  }
`;
export const SortItemModifiedActive = styled.span`
  text-decoration: underline;
  font-weight: bold;
  color: #a78adc
  cursor: pointer;
`;

const TableHeadSortDirectionModified: React.FC<{
  currentSort: string;
  setCurrentSort: (str: string) => void;
}> = ({ currentSort, setCurrentSort }) => {
  return (
    <>
      {currentSort === SORT_BY.MODIFIED_ASC && (
        <>
          <SortItemModifiedActive>Asc</SortItemModifiedActive>&nbsp;/&nbsp;
        </>
      )}
      {currentSort !== SORT_BY.MODIFIED_ASC && (
        <>
          <SortItemModifiedInactive
            onClick={() => setCurrentSort(SORT_BY.MODIFIED_ASC)}
          >
            Asc
          </SortItemModifiedInactive>
          &nbsp;/&nbsp;
        </>
      )}
      {currentSort === SORT_BY.MODIFIED_DESC && (
        <SortItemModifiedActive>Desc</SortItemModifiedActive>
      )}
      {currentSort !== SORT_BY.MODIFIED_DESC && (
        <SortItemModifiedInactive
          onClick={() => setCurrentSort(SORT_BY.MODIFIED_DESC)}
        >
          Desc
        </SortItemModifiedInactive>
      )}
    </>
  );
};

export default TableHeadSortDirectionModified;
