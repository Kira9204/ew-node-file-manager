import React from 'react';
import styled from 'styled-components';
import { FileStatInfo } from '../../../../reducer';

const SelectAllTableHead = styled.span`
  &:hover {
    color: green;
    text-decoration: underline;
    cursor: pointer;
  }
`;

const TableHeadFilesSelect: React.FC<{
  filesData: FileStatInfo[];
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
}> = ({ filesData, selectedFiles, setSelectedFiles }) => {
  if (filesData.length !== selectedFiles.length || filesData.length === 0) {
    return (
      <SelectAllTableHead
        onClick={() => {
          const allFileNames = filesData.map((e) => e.name);
          setSelectedFiles(allFileNames);
        }}
      >
        Select all
      </SelectAllTableHead>
    );
  }

  return (
    <SelectAllTableHead
      onClick={() => {
        setSelectedFiles([]);
      }}
    >
      Deselect all
    </SelectAllTableHead>
  );
};

export default TableHeadFilesSelect;
