import React from 'react';
import { useHistory } from 'react-router';
import { FileStatInfo } from '../../../../reducer';
import {
  Link,
  LinkSpan,
  TableColName,
  TableColNameAlign,
  TableColNameIcon
} from '../../styles';
import { getFAIcon, isAudio, isImage, isText, isVideo } from '../../utils';
import {
  generateDownloadURL,
  pushNewHistoryLocation,
  generatePreviewURL
} from '../../../../service';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import styled from 'styled-components';
import { manualPreviewState } from '../../index';

const TableColNameIconCheckbox = styled.input.attrs({
  className: 'checkbox-inline',
  type: 'checkbox'
})`
  margin-right: 10px;
  position: relative;
  top: 7px;
  zoom: 1.2;
`;

const TableColNameIconTogglePopover = styled.i`
  vertical-align: middle;
  font-size: 100%;
  margin-left: 10px;
  color: green;
  cursor: pointer;
`;

const ToolTip = styled.div`
  position: relative;
`;

const ToolTipXButton = styled.button.attrs({
  className: 'fas fa-window-close'
})`
  position: absolute;
  background: black;
  color: white;
  top: -20px;
  right: -20px;
  font-size: 25px;
  margin: 0;
  padding: 0;
  border: 0;
`;

const ToolTipAudio = styled.audio.attrs({
  controls: true,
  autoplay: true
})`
  margin-left: 30px;
`;

const previewWidth = 640;
const previewHeight = 360;

const ToolTipImage = styled.img`
  max-height: ${previewHeight}px;
  height: auto;
  width: auto;
  border: 0;
  margin-left: 30px;
`;

const ToolTipText = styled.iframe`
  width: ${previewWidth}px;
  height: ${previewHeight}px;
  background-color: #fff;
  color: #000;
  margin-left: 30px;
  border: 0;
`;

const ToolTipVideo = styled.video.attrs({
  controls: true,
  autoplay: true,
  loop: true
})`
  width: ${previewWidth}px;
  height: ${previewHeight}px;
  background-color: #000;
  margin-left: 30px;
  border: 0;
`;

const TableColNameComponent: React.FC<{
  fileItem: FileStatInfo;
  setPreviewFileName: (s: string) => void;
  selectedFiles: string[];
  setSelectedFiles: (arr: string[]) => void;
}> = ({ fileItem, setPreviewFileName, selectedFiles, setSelectedFiles }) => {
  const history = useHistory();

  const togglePreview = () => {
    if (manualPreviewState.get(fileItem.name)) {
      manualPreviewState.set(fileItem.name, false);
    } else {
      manualPreviewState.set(fileItem.name, true);
      setPreviewFileName(fileItem.name);
    }
  };

  const createCloseButton = () => {
    return (
      <ToolTipXButton
        onClick={() => {
          const element = document.getElementById(
            `${fileItem.name}-manual-preview`
          );
          if (element) {
            element.click();
          }
        }}
      />
    );
  };

  const createCheckbox = () => {
    const isChecked = selectedFiles.includes(fileItem.name);
    return (
      <TableColNameIconCheckbox
        checked={isChecked}
        onClick={() => {
          if (isChecked) {
            const newArr = selectedFiles.filter((e) => e !== fileItem.name);
            setSelectedFiles(newArr);
          } else {
            const newArr = selectedFiles.slice(0);
            newArr.push(fileItem.name);
            setSelectedFiles(newArr);
          }
        }}
      />
    );
  };

  if (fileItem.isDirectory) {
    return (
      <TableColName>
        <>
          {createCheckbox()}
          <LinkSpan
            onClick={() => pushNewHistoryLocation(fileItem.path, history)}
          >
            <TableColNameIcon
              className={getFAIcon(
                fileItem.name,
                fileItem.extension,
                fileItem.isDirectory
              )}
            />
            <TableColNameAlign>{fileItem.name}</TableColNameAlign>
          </LinkSpan>
        </>
      </TableColName>
    );
  }
  //Apparently overlay cannot be generated on the fly (Tooltip won't remember position)...
  else if (isImage(fileItem.name)) {
    return (
      <TableColName>
        <>
          {createCheckbox()}
          <Link href={generateDownloadURL(fileItem.path)} target="_blank">
            <TableColNameIcon
              className={getFAIcon(
                fileItem.name,
                fileItem.extension,
                fileItem.isDirectory
              )}
            />
            <TableColNameAlign>{fileItem.name}</TableColNameAlign>
          </Link>
          <TableColNameAlign>
            <OverlayTrigger
              placement="right-end"
              trigger="click"
              overlay={
                <ToolTip>
                  {createCloseButton()}
                  <ToolTipImage
                    src={generatePreviewURL(
                      fileItem.path +
                        `?width=${previewHeight}&height=${previewHeight}`
                    )}
                    alt={fileItem.name}
                    onClick={() => togglePreview()}
                  />
                </ToolTip>
              }
            >
              <TableColNameIconTogglePopover
                className="far fa-eye"
                style={{ fontSize: '150%' }}
                id={`${fileItem.name}-manual-preview`}
                onClick={() => togglePreview()}
              />
            </OverlayTrigger>
          </TableColNameAlign>
        </>
      </TableColName>
    );
  } else if (isText(fileItem.name)) {
    return (
      <TableColName>
        <>
          {createCheckbox()}
          <Link href={generateDownloadURL(fileItem.path)} target="_blank">
            <TableColNameIcon
              className={getFAIcon(
                fileItem.name,
                fileItem.extension,
                fileItem.isDirectory
              )}
            />
            <TableColNameAlign>{fileItem.name}</TableColNameAlign>
          </Link>
          <TableColNameAlign>
            <OverlayTrigger
              placement="right-end"
              trigger="click"
              overlay={
                <ToolTip>
                  {createCloseButton()}
                  <ToolTipText
                    src={generatePreviewURL(fileItem.path)}
                    onClick={() => togglePreview()}
                  />
                  }
                </ToolTip>
              }
            >
              <TableColNameIconTogglePopover
                className="far fa-eye"
                style={{ fontSize: '150%' }}
                id={`${fileItem.name}-manual-preview`}
                onClick={() => togglePreview()}
              />
            </OverlayTrigger>
          </TableColNameAlign>
        </>
      </TableColName>
    );
  } else if (isAudio(fileItem.name)) {
    return (
      <TableColName>
        <>
          {createCheckbox()}
          <Link href={generateDownloadURL(fileItem.path)} target="_blank">
            <TableColNameIcon
              className={getFAIcon(
                fileItem.name,
                fileItem.extension,
                fileItem.isDirectory
              )}
            />
            <TableColNameAlign>{fileItem.name}</TableColNameAlign>
          </Link>
          <TableColNameAlign>
            <OverlayTrigger
              placement="right-end"
              trigger="click"
              overlay={
                <ToolTip>
                  {createCloseButton()}
                  <ToolTipAudio>
                    <source
                      src={generateDownloadURL(fileItem.path)}
                      type={fileItem.mime}
                    />
                  </ToolTipAudio>
                </ToolTip>
              }
            >
              <TableColNameIconTogglePopover
                className="fas fa-play"
                id={`${fileItem.name}-manual-preview`}
                onClick={() => {
                  togglePreview();
                  setTimeout(() => {
                    const element = document.querySelector('audio');
                    if (element) {
                      element.play();
                    }
                  }, 500);
                }}
              />
            </OverlayTrigger>
          </TableColNameAlign>
        </>
      </TableColName>
    );
  } else if (isVideo(fileItem.name)) {
    return (
      <TableColName>
        <>
          {createCheckbox()}
          <Link href={generateDownloadURL(fileItem.path)} target="_blank">
            <TableColNameIcon
              className={getFAIcon(
                fileItem.name,
                fileItem.extension,
                fileItem.isDirectory
              )}
            />
            <TableColNameAlign>{fileItem.name}</TableColNameAlign>
          </Link>
          <TableColNameAlign>
            <OverlayTrigger
              placement="right-end"
              trigger="click"
              overlay={
                <ToolTip>
                  {createCloseButton()}
                  <ToolTipVideo>
                    <source
                      src={generateDownloadURL(fileItem.path)}
                      type={fileItem.mime}
                    />
                  </ToolTipVideo>
                </ToolTip>
              }
            >
              <TableColNameIconTogglePopover
                className="fas fa-play"
                id={`${fileItem.name}-manual-preview`}
                onClick={() => {
                  togglePreview();
                  setTimeout(() => {
                    const element = document.querySelector('video');
                    if (element) {
                      element.play();
                    }
                  }, 500);
                }}
              />
            </OverlayTrigger>
          </TableColNameAlign>
        </>
      </TableColName>
    );
  }
  return (
    <TableColName>
      {createCheckbox()}
      <Link href={generateDownloadURL(fileItem.path)} target="_blank">
        <TableColNameIcon
          className={getFAIcon(
            fileItem.name,
            fileItem.extension,
            fileItem.isDirectory
          )}
        />
        <TableColNameAlign>{fileItem.name}</TableColNameAlign>
      </Link>
    </TableColName>
  );
};

export default TableColNameComponent;
