import React from 'react';
import {
  arraysContainsSameNames,
  filterSearchNameFiles,
  filterValidSelectedFiles,
  formatFileSize,
  formatMTime,
  SORT_BY,
  sortFilePath
} from './utils';
import { ACTION_TYPES, usePreviousHook } from '../../reducer';
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
import TableHeadSortDirectionName from './components/table-head/TableHeadSortDirectionName';
import TableHeadSortDirectionKind from './components/table-head/TableHeadSortDirectionKind';
import TableHeadSortDirectionSize from './components/table-head/TableHeadSortDirectionSize';
import TableHeadSortDirectionModified from './components/table-head/TableHeadSortDirectionModified';
import TableColNameComponent from './components/cols/TableColNameComponent';
import LocationSegment from './components/table-head/LocationSegment';
import LocationOneUp from './components/table-head/LocationOneUp';
import DiskStatsTable from './components/DiskStatsTable';
import {generateZIPDownloadURL, getAuthForPath} from '../../service';
import TableHeadFilesSelect from './components/table-head/TableHeadFilesSelect';
import LocationLocked from './components/table-head/LocationLocked';
import LocationLockedClear from './components/table-head/LocationLockedClear';
import DialogUploadFile from './components/dialogs/DialogUploadFile';
import DialogDeleteFile from './components/dialogs/DialogDeleteFiles';
import {LOCATION_LOGIN_MODIFY_KEY, SETTING_SHOW_MODIFY_BUTTONS} from '../../constants';
import Search from './components/Search';
import { useRootReducerProvider } from '../../index';
import LoginTableFileModify from "./components/LoginTableFileModify";

export const manualPreviewState: Map<string, boolean> = new Map();
const FileTable: React.FC = () => {
  const { state, dispatch } = useRootReducerProvider();
  const { pathData } = state;
  const location = state.fsLocation;
  const foundModifyAuth = getAuthForPath(location, false, LOCATION_LOGIN_MODIFY_KEY);
  const {
    filePathIsReady,
    filesData,
    searchContains,
    currentSort,
    selectedFiles,
    previewFileName
  } = state.fileTable;
  const prevFsLocation = usePreviousHook(state.fsLocation);
  const prevSort = usePreviousHook(currentSort);
  const prevSearch = usePreviousHook(searchContains);
  const prevFileNames = usePreviousHook(
    state.pathData!.files.map((e) => e.name)
  );

  React.useEffect(() => {
    if (
      prevFsLocation === location &&
      prevSort === currentSort &&
      prevSearch === searchContains &&
      arraysContainsSameNames(
        pathData!.files.map((e) => e.name),
        prevFileNames!
      )
    ) {
      return;
    }

    manualPreviewState.clear();
    const filteredPathData = filterSearchNameFiles(
      searchContains,
      pathData!.files
    );
    const sortedPathData = sortFilePath(currentSort, filteredPathData);
    const validSelectedFiles = filterValidSelectedFiles(
      selectedFiles,
      sortedPathData
    );

    const payload = {
      filesData: sortedPathData,
      currentSort: currentSort === '' ? SORT_BY.NAME_DESC : currentSort,
      selectedFiles: validSelectedFiles
    };
    dispatch({
      type: ACTION_TYPES.SET_FILETABLE_UPDATED_SETTINGS,
      payload
    });
  }, [
    currentSort,
    dispatch,
    location,
    pathData,
    prevFileNames,
    prevFsLocation,
    prevSearch,
    prevSort,
    searchContains,
    selectedFiles
  ]);

  React.useEffect(() => {
    manualPreviewState.forEach((isOpen, fileName) => {
      if (fileName === previewFileName) {
        return;
      } else if (isOpen) {
        const element = document.getElementById(`${fileName}-manual-preview`);
        if (element) {
          element.click();
        }
      }
    });
  }, [previewFileName]);

  const setCurrentSort = (sort: string) => {
    dispatch({
      type: ACTION_TYPES.SET_FILETABLE_SORT_BY,
      payload: sort
    });
  };

  const setSelectedFiles = (selectedFiles: string[]) => {
    dispatch({
      type: ACTION_TYPES.SET_FILETABLE_SELECTED_FILES,
      payload: selectedFiles
    });
  };

  const setSearchContains = (searchString: string) => {
    dispatch({
      type: ACTION_TYPES.SET_FILETABLE_SEARCH_CONTAINS,
      payload: searchString
    });
  };

  const setPreviewFileName = (previewFileName: string) => {
    dispatch({
      type: ACTION_TYPES.SET_FILETABLE_PREVIEW_FILE,
      payload: previewFileName
    });
  };

  if (!filesData) {
    return null;
  }
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
                <span style={{marginLeft: '15px'}} />
              <LocationSegment location={location} />
              &nbsp;
              <LocationLocked />
              &nbsp;
              <LocationLockedClear />
              <br />
              <Search
                searchContains={searchContains}
                setSearchContains={setSearchContains}
              />
            </th>
            <th>Kind</th>
            <th>Size</th>
            <th>Modified</th>
          </tr>
        </thead>
        <tbody>
          {filePathIsReady &&
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
        <LinkWhite
          href={
            selectedFiles.length > 0
              ? generateZIPDownloadURL(location, selectedFiles)
              : '#'
          }
        >
          <TableSelectedDownloadButton>
            ZIP Download
            {selectedFiles.length > 0 ? ` (${selectedFiles.length})` : ''}
          </TableSelectedDownloadButton>
        </LinkWhite>
        {SETTING_SHOW_MODIFY_BUTTONS && foundModifyAuth && (
          <>
            <DialogUploadFile />
            <DialogDeleteFile setSelectedFiles={setSelectedFiles} />
          </>
        )}
      </CenterDiv>
      <DiskStatsTable pathData={pathData!} />
      <LoginTableFileModify />
    </div>
  );
};

export default FileTable;
