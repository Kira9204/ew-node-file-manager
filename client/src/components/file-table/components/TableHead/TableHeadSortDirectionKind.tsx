import React from "react";
import styled from "styled-components";
import {SORT_BY} from "../../utils";

export const SortExtensionInactive = styled.span`
  &:hover {
    color: #fd7e14;
    text-decoration: underline;
    cursor: pointer;
  }
`;
export const SortExtensionActive = styled.span`
  text-decoration: underline;
  font-weight: bold;
  color: #fd7e14;
  cursor: pointer;
`;

const TableHeadSortDirectionKind: React.FC<{
  currentSort: string;
  setCurrentSort: (str: string) => void;
}> = ({ currentSort, setCurrentSort }) => {
  return (
    <>
      {currentSort === SORT_BY.KIND_ASC && (
        <>
          <SortExtensionActive>Asc</SortExtensionActive>&nbsp;/&nbsp;
        </>
      )}
      {currentSort !== SORT_BY.KIND_ASC && (
        <>
          <SortExtensionInactive
            onClick={() => setCurrentSort(SORT_BY.KIND_ASC)}
          >
            Asc
          </SortExtensionInactive>
          &nbsp;/&nbsp;
        </>
      )}
      {currentSort === SORT_BY.KIND_DESC && (
        <SortExtensionActive>Desc</SortExtensionActive>
      )}
      {currentSort !== SORT_BY.KIND_DESC && (
        <SortExtensionInactive
          onClick={() => setCurrentSort(SORT_BY.KIND_DESC)}
        >
          Desc
        </SortExtensionInactive>
      )}
    </>
  );
};

export default TableHeadSortDirectionKind;
