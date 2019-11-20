import fileSize from 'filesize';
import mimeTypes from 'mime-types';
import { FileStatInfo } from '../../reducer';
import path from 'path';

const UTCTimeOffset = new Date().getTimezoneOffset();
export const formatFileSize = (size: number) => {
  return fileSize(size, { base: 10, round: 2 });
};
export const formatMTime = (mTimeUnix: number) => {
  const date = new Date(mTimeUnix + 60000 * UTCTimeOffset);
  return `${date.getFullYear()}-${
    date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()} ${
    date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  }:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:${
    date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  }`;
};

export const getFAIcon = (
  fileName: string,
  fileExtension: string,
  isDirectory: boolean
) => {
  if (isDirectory) {
    return 'far fa-folder';
  } else if (isImage(fileName)) {
    return 'far fa-file-image';
  }
  switch (fileExtension) {
    case 'MP4':
    case 'MKV':
    case 'AVI':
    case 'WEBM':
    case 'MOV':
    case 'OGG':
    case 'FLV':
    case 'WMV':
      return 'far fa-file-video';
    case 'MP3':
    case 'M4A':
    case 'OGA':
    case 'FLAC':
    case 'WAV':
    case 'MID':
    case 'WMA':
    case 'AAC':
      return 'far fa-file-audio';
    case 'PDF':
      return 'far fa-file-pdf';
    case 'DOC':
    case 'DOCX':
    case 'ODT':
      return 'far fa-file-word';
    case 'PPT':
    case 'PPTX':
    case 'PPTM':
    case 'ODP':
    case 'OTP':
      return 'far fa-file-powerpoint';
    case 'XL':
    case 'XLS':
    case 'XLSX':
    case 'XLSB':
    case 'XLSHTML':
    case 'XLSM':
    case 'XLMHTML':
    case 'XLTHTML':
    case 'XLTM':
    case 'XLTX':
      return 'far fa-file-excel';
    case 'TXT':
    case 'INI':
    case 'LOG':
    case 'CONF':
    case 'CF':
      return 'far fa-file-alt';
    case 'JS':
    case 'JSX':
    case 'TS':
    case 'TSX':
    case 'CSS':
    case 'SCSS':
    case 'PHP':
    case 'HTM':
    case 'HTML':
    case 'JAVA':
    case 'S':
    case 'CS':
    case 'C':
    case 'CPP':
    case 'RS':
    case 'GO':
    case 'JSON':
    case 'XML':
      return 'far fa-file-code';
    case 'ISO':
    case 'BIN':
    case 'CUE':
    case 'MDF':
    case 'IMG':
    case 'NRG':
      return 'fas fa-compact-disc';
    case 'ZIP':
    case 'RAR':
    case '7Z':
      return 'far fa-file-archive';
    default:
      return 'far fa-file';
  }
};

export const isImage = (fileName: string) => {
  const res = mimeTypes.lookup(fileName);
  if (!res) {
    return false;
  }
  return res.startsWith('image/');
};
export const isText = (fileName: string) => {
  if (['.pdf', '.cf', '.service'].includes(path.extname(fileName))) {
    return true;
  }

  const res = mimeTypes.lookup(fileName);
  if (!res) {
    return false;
  }
  return res.startsWith('text/');
};
export const isAudio = (fileName: string) => {
  const res = mimeTypes.lookup(fileName);
  if (!res) {
    return false;
  }
  return res.startsWith('audio/');
};
export const isVideo = (fileName: string) => {
  const res = mimeTypes.lookup(fileName);
  if (!res) {
    return false;
  }
  return res.startsWith('video/');
};

export const getFoldersSizeNumbers = (files: FileStatInfo[]) => {
  let numFolders = 0;
  let sizeFolders = 0;
  let numFiles = 0;
  let sizeFiles = 0;

  files.forEach((e) => {
    if (e.isDirectory) {
      numFolders += 1;
      sizeFolders += e.size;
    } else {
      numFiles += 1;
      sizeFiles += e.size;
    }
  });
  return {
    numFolders,
    sizeFolders,
    numFiles,
    sizeFiles
  };
};

/**
 * Sorts fileStats by placing newest first
 * @param fileStats
 */
export const sortFileStatsByDate = (fileStats: FileStatInfo[]) => {
  fileStats.sort((a, b) => {
    if (a.modifiedTimeUTC > b.modifiedTimeUTC) {
      return -1;
    } else if (a.modifiedTimeUTC < b.modifiedTimeUTC) {
      return 1;
    }
    return 0;
  });
};

/**
 * Sorts fileStats A->Z
 * @param fileStats
 */
export const sortFileStatsByName = (fileStats: FileStatInfo[]) => {
  // @ts-ignore
  const reg = /\.[^/.]+$/;
  // @ts-ignore
  fileStats.sort((a, b) => {
    const fileNameA = a.name.replace(reg, '');
    const fileNameB = b.name.replace(reg, '');
    return '' + fileNameA.localeCompare(fileNameB);
  });
};

/**
 * Sorts fileStats A->Z
 * @param fileStats
 */
export const sortFileStatsExtensionName = (fileStats: FileStatInfo[]) => {
  fileStats.sort((a, b) => {
    if (a.extension < b.extension) {
      return -1;
    } else if (a.extension > b.extension) {
      return 1;
    }
    return 0;
  });
};

/**
 * Sorts fileStats by placing the largest first
 * @param fileStats
 */
export const sortFileStatsBySize = (fileStats: FileStatInfo[]) => {
  fileStats.sort((a, b) => {
    return b.size - a.size;
  });
};

export enum SORT_BY {
  MODIFIED_ASC = 'modified-asc',
  MODIFIED_DESC = 'modified-desc',
  SIZE_ASC = 'size-asc',
  SIZE_DESC = 'size-desc',
  KIND_ASC = 'kind-asc',
  KIND_DESC = 'kind-desc',
  NAME_ASC = 'name-asc',
  NAME_DESC = 'name-desc'
}
export const SORT_BY_STORAGE_KEY = 'sort-by';
export const sortFilePath = (
  currentSort: string,
  filesData: FileStatInfo[],
  setFilesData: (obj: FileStatInfo[]) => void,
  setHasSortedFilePath: (val: boolean) => void
) => {
  let newFilesData = filesData.slice(0);
  switch (currentSort) {
    case SORT_BY.MODIFIED_DESC:
      sortFileStatsByDate(newFilesData);
      localStorage.setItem(SORT_BY_STORAGE_KEY, SORT_BY.MODIFIED_DESC);
      setFilesData(newFilesData);
      setHasSortedFilePath(true);
      break;
    case SORT_BY.MODIFIED_ASC:
      sortFileStatsByDate(newFilesData);
      newFilesData.reverse();
      localStorage.setItem(SORT_BY_STORAGE_KEY, SORT_BY.MODIFIED_ASC);
      setFilesData(newFilesData);
      setHasSortedFilePath(true);
      break;
    case SORT_BY.SIZE_DESC:
      sortFileStatsBySize(newFilesData);
      localStorage.setItem(SORT_BY_STORAGE_KEY, SORT_BY.SIZE_DESC);
      setFilesData(newFilesData);
      setHasSortedFilePath(true);
      break;
    case SORT_BY.SIZE_ASC:
      sortFileStatsBySize(newFilesData);
      newFilesData.reverse();
      localStorage.setItem(SORT_BY_STORAGE_KEY, SORT_BY.SIZE_ASC);
      setFilesData(newFilesData);
      setHasSortedFilePath(true);
      break;
    case SORT_BY.KIND_ASC:
      sortFileStatsExtensionName(newFilesData);
      localStorage.setItem(SORT_BY_STORAGE_KEY, SORT_BY.KIND_ASC);
      setFilesData(newFilesData);
      setHasSortedFilePath(true);
      break;
    case SORT_BY.KIND_DESC:
      sortFileStatsExtensionName(newFilesData);
      newFilesData.reverse();
      localStorage.setItem(SORT_BY_STORAGE_KEY, SORT_BY.KIND_DESC);
      setFilesData(newFilesData);
      setHasSortedFilePath(true);
      break;
    case SORT_BY.NAME_ASC:
      sortFileStatsByName(newFilesData);
      localStorage.setItem(SORT_BY_STORAGE_KEY, SORT_BY.NAME_ASC);
      setFilesData(newFilesData);
      setHasSortedFilePath(true);
      break;
    case SORT_BY.NAME_DESC:
      sortFileStatsByName(newFilesData);
      newFilesData.reverse();
      localStorage.setItem(SORT_BY_STORAGE_KEY, SORT_BY.NAME_DESC);
      setFilesData(newFilesData);
      setHasSortedFilePath(true);
      break;
  }
};
