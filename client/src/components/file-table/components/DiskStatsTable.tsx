import { TableColNameAlign, TableColNameIcon, TableRow } from '../styles';
import { formatFileSize, getFAIcon, getFoldersSizeNumbers } from '../utils';
import React from 'react';
import { FileListDataResponse } from '../../../reducer';
import styled from 'styled-components';
import Table from 'react-bootstrap/Table';
import Progressbar from 'react-bootstrap/ProgressBar';
import AuthorText from '../../AuthorText';

interface Props {
  pathData: FileListDataResponse;
}

const DiskStatsTableEl = styled(Table).attrs({
  variant: 'dark',
  bordered: true
})`
  margin-top: 40px;
  margin-left: auto;
  margin-right: auto;
  max-width: 90%;
  &&& {
    color: #dee2e6;
  }
`;

const DiskStatsTableTDSpacer = styled.div`
  margin-top: 10px;
`;

const DiskStatsTableTotalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DiskStatsTable: React.FC<Props> = ({ pathData }) => {
  const sizeInfo = getFoldersSizeNumbers(pathData.files);
  const diskUsage = pathData.diskInfo.total - pathData.diskInfo.free;
  const diskUsagePercent = Math.ceil(
    (diskUsage / pathData.diskInfo.total) * 100
  );

  return (
    <DiskStatsTableEl>
      <thead></thead>
      <tbody>
        <TableRow>
          <td>
            <TableColNameIcon className={getFAIcon('', '', true)} />
            <TableColNameAlign>
              &nbsp;Total: {sizeInfo.numFolders}
              {sizeInfo.sizeFolders !== 0 && (
                <>.&nbsp;Size: {formatFileSize(sizeInfo.sizeFolders)}</>
              )}
            </TableColNameAlign>
            <DiskStatsTableTDSpacer />
            <TableColNameIcon className={getFAIcon('', '', false)} />
            <TableColNameAlign>
                <span style={{marginLeft: '17px'}} />
              Total: {sizeInfo.numFiles}
              {sizeInfo.sizeFiles !== 0 && (
                <>.&nbsp;Size: {formatFileSize(sizeInfo.sizeFiles)}</>
              )}
            </TableColNameAlign>
            <DiskStatsTableTDSpacer />
            <DiskStatsTableTotalContainer>
              <TableColNameIcon className="far fa-hdd" />
              <Progressbar
                style={{ width: '100%', height: '20px', color: '#dee2e6' }}
                now={diskUsagePercent}
                label={
                  '' +
                  formatFileSize(diskUsage) +
                  ' / ' +
                  formatFileSize(pathData.diskInfo.total) +
                  ' (' +
                  diskUsagePercent +
                  '%)'
                }
              />
            </DiskStatsTableTotalContainer>
              <AuthorText marginTop='8px'/>
          </td>
        </TableRow>
      </tbody>
    </DiskStatsTableEl>
  );
};

export default DiskStatsTable;
