import React from 'react';
import {
  formatFileSize,
  formatMTime,
  SORT_BY,
  SORT_BY_STORAGE_KEY,
  sortFilePath
} from './utils';
import { FileListDataResponse } from '../../reducer';
import {
  CenterDiv,
  LinkWhite,
  Table,
  TableColKind,
  TableColModified,
  TableColSize,
  TableRow,
  TableSelectedDownloadButton
} from './styles';
import TableHeadSortDirectionName from './components/TableHead/TableHeadSortDirectionName';
import TableHeadSortDirectionKind from './components/TableHead/TableHeadSortDirectionKind';
import TableHeadSortDirectionSize from './components/TableHead/TableHeadSortDirectionSize';
import TableHeadSortDirectionModified from './components/TableHead/TableHeadSortDirectionModified';
import TableColNameComponent from './components/Cols/TableColNameComponent';
import LocationSegment from './components/TableHead/LocationSegment';
import LocationOneUp from './components/TableHead/LocationOneUp';
import DiskStatsTable from './components/DiskStatsTable';
import { generateZIPDownloadURL } from '../../service';
import TableHeadFilesSelect from './components/TableHead/TableHeadFilesSelect';

interface Props {
  pathData: FileListDataResponse;
  location: string;
}

export const manualPreviewState: Map<string, boolean> = new Map();
const FileTable: React.FC<Props> = ({ pathData, location }) => {
  const [filesData, setFilesData] = React.useState(pathData.files);
  const [currentSort, setCurrentSort] = React.useState(
    '' + localStorage.getItem(SORT_BY_STORAGE_KEY)
  );
  const [hasSortedFilePath, setHasSortedFilePath] = React.useState(false);
  const [previewFileName, setPreviewFileName] = React.useState('');
  const [selectedFiles, setSelectedFiles] = React.useState<Array<string>>([]);
  React.useEffect(() => {
    if (currentSort === 'null') {
      setCurrentSort(SORT_BY.KIND_ASC);
      return;
    }
    manualPreviewState.clear();
    setFilesData(pathData.files);
    sortFilePath(
      currentSort,
      pathData.files,
      setFilesData,
      setHasSortedFilePath
    );
  }, [currentSort, pathData.files]);

  React.useEffect(() => {
    manualPreviewState.forEach((isOpen, fileName) => {
      if (fileName === previewFileName) {
        return;
      } else if (isOpen) {
        const element = document.getElementById(`${fileName}-manual-preview`);
        if (!element) {
          return;
        }
        element.click();
      }
    });
  }, [previewFileName]);

  return (
    <div>
      <Table style={{ marginBottom: 8 }}>
        <thead>
          <tr>
            <th>
              <TableHeadSortDirectionName
                currentSort={currentSort}
                setCurrentSort={setCurrentSort}
              />
              <br />
              <TableHeadFilesSelect
                filesData={filesData}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
              />
            </th>
            <th>
              <TableHeadSortDirectionKind
                currentSort={currentSort}
                setCurrentSort={setCurrentSort}
              />
            </th>
            <th>
              <TableHeadSortDirectionSize
                currentSort={currentSort}
                setCurrentSort={setCurrentSort}
              />
            </th>
            <th>
              <TableHeadSortDirectionModified
                currentSort={currentSort}
                setCurrentSort={setCurrentSort}
              />
            </th>
          </tr>
          <tr>
            <th>
              <LocationOneUp location={location} />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <LocationSegment location={location} />
            </th>
            <th>Kind</th>
            <th>Size</th>
            <th>Modified</th>
          </tr>
        </thead>
        <tbody>
          {hasSortedFilePath &&
            filesData.map((fileItem, index) => (
              <TableRow key={fileItem.name + index}>
                <TableColNameComponent
                  fileItem={fileItem}
                  setPreviewFileName={setPreviewFileName}
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                />
                <TableColKind>
                  {fileItem.isDirectory ? '<DIR>' : fileItem.extension}
                </TableColKind>
                <TableColSize>
                  {fileItem.size > 0 && formatFileSize(fileItem.size)}
                </TableColSize>
                <TableColModified>
                  {formatMTime(fileItem.modifiedTimeUTC)}
                </TableColModified>
              </TableRow>
            ))}
        </tbody>
      </Table>
      <CenterDiv>
        <LinkWhite href={generateZIPDownloadURL(location, selectedFiles)}>
          <TableSelectedDownloadButton>
            ZIP Download
            {selectedFiles.length > 0 ? ` (${selectedFiles.length})` : ''}
          </TableSelectedDownloadButton>
        </LinkWhite>
      </CenterDiv>
      <DiskStatsTable pathData={pathData} />
    </div>
  );
};

export default FileTable;
