import path from 'path';
import { PATH_PUBLIC_FILES } from '../app';
import fs from 'fs';
import getImageSize from 'image-size';
import mimeTypes from 'mime-types';
import sharp from 'sharp';
import md5File from 'md5-file';
import stream from 'stream';
// @ts-ignore
import diskUsage from 'diskusage';
import queryString from 'query-string';
import archiver from 'archiver';
import express from 'express';

interface FileListDataResponse {
  diskInfo: {
    available: number;
    free: number;
    total: number;
  };
  files: FileStatInfo[];
}

interface FileStatInfo {
  name: string;
  path: string;
  extension: string;
  mime: string;
  canPreview: boolean;
  isDirectory: boolean;
  size: number;
  modifiedTimeUTC: number;
}

/**
 * Translate the request filepath to the File system filepath
 * @param paths
 */
export const getJailTranslatePath = (...paths: string[]) => {
  const newPath = paths.reduce((a, b) => path.join(a, b), PATH_PUBLIC_FILES);
  if (!newPath.startsWith(PATH_PUBLIC_FILES)) {
    return null;
  }
  return newPath;
};

/**
 * Loads metadata about a file or folder, returns null if the path cannot be read
 * @param path
 */
const getFileStats = (path: string) => {
  try {
    return fs.statSync(path);
  } catch (e) {
    return null;
  }
};

/**
 * Recursively walks down all folders and returns a list of all files below the folder
 * @param dir
 */
const walkRecursivelyDownFolder = (dir: string) => {
  let results: any = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.normalize(dir + '/' + file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      //Recurse into a subdirectory
      results = results.concat(walkRecursivelyDownFolder(file));
    } else {
      //Is a file
      results.push(file);
    }
  });
  return results;
};

/**
 * Recursively walks down all folders and calculates the resulting size on disk.
 * @param dir
 */
const getFolderFileSize = (dir: string) => {
  const filePaths = walkRecursivelyDownFolder(dir);
  let finalSize = 0;
  filePaths.forEach((filePath: string) => {
    const stat = fs.statSync(filePath);
    finalSize += stat.size;
  });
  return finalSize;
};

/**
 * Returns info about the directory disk like:
 * Available
 * Free
 * Total
 */
const getDiskInfo = () => {
  return diskUsage.checkSync(PATH_PUBLIC_FILES);
};

/**
 * Generates an MD5 hash of a file
 * @param filePath
 */
const generateFileMD5 = (filePath: string) => {
  return md5File.sync(filePath);
};

/**
 * Does this file resemble an image? (only checks file extension)
 * @param fileName
 */
const isImage = (fileName: string) => {
  const res = mimeTypes.lookup(fileName);
  if (!res) {
    return false;
  }
  return res.startsWith('image/');
};

/**
 * Does this file resemble a text file?
 * @param fileName
 */
const isText = (fileName: string) => {
  if (['.cf', '.service'].includes(path.extname(fileName))) {
    return true;
  }

  const res = mimeTypes.lookup(fileName);
  if (!res || res === 'application/octet-stream') {
    return false;
  }
  return res.startsWith('text/') || res.startsWith('application/');
};

/**
 * Sends a file buffer to the client over HTTP using express
 * @param filePath
 * @param res
 */
export const sendFile = (filePath: string, res: express.Response) => {
  const r = fs.createReadStream(filePath);
  const ps = new stream.PassThrough(); // <---- this makes a trick with stream error handling
  stream.pipeline(r, ps, (err) => {
    if (err) {
      console.log(err);
      return res.sendStatus(400);
    }
  });
  return ps.pipe(res);
};

/**
 * Generates a preview of either an image file or a text file
 * @param req
 * @param res
 */
export const generateFilePreview = (
  req: express.Request,
  res: express.Response
) => {
  const requestPath = req.params[0];
  const fsPath = getJailTranslatePath(requestPath);
  if (!fsPath) {
    return res
      .status(403)
      .json({ status: 403, message: 'You cannot access files outside of jail' })
      .send();
  }
  if (!fs.existsSync(fsPath)) {
    return res
      .status(404)
      .json({ status: 404, message: 'The file provided does not exist!' })
      .send();
  }
  if (isImage(req.params[0])) {
    return generateImageFilePreview(fsPath, req, res);
  } else if (isText(requestPath)) {
    return generateTextFilePreview(fsPath, req, res);
  }

  return res
    .status(400)
    .json({
      status: 400,
      message:
        "Files of mime-type '" +
        mimeTypes.lookup(fsPath) +
        "' cannot be previewed"
    })
    .send();
};

/**
 * Generates a preview of an image file
 * @param fsPath
 * @param req
 * @param res
 */
const generateImageFilePreview = (
  fsPath: string,
  req: express.Request,
  res: express.Response
) => {
  if (isNaN(req.query.width) || isNaN(req.query.height)) {
    return res
      .status(400)
      .json({
        status: 400,
        message: 'Width and height parameters must be present'
      })
      .send();
  }

  const requestedWidth = parseInt(req.query.width);
  const requestedHeight = parseInt(req.query.height);

  const requestPath = req.params[0];
  if (!isImage(requestPath)) {
    return res
      .status(400)
      .json({ status: 400, message: 'This is not an image' })
      .send();
  }

  // @ts-ignore
  const imginfo = getImageSize(fsPath);
  if (
    imginfo.width < requestedWidth ||
    imginfo.height < requestedHeight ||
    imginfo.type === 'gif'
  ) {
    return sendFile(fsPath, res);
  }

  const thumbsDir = path.normalize(PATH_PUBLIC_FILES + '/__generated_thumbs__');
  if (!fs.existsSync(thumbsDir)) {
    fs.mkdirSync(thumbsDir);
  }

  const ext = path.extname(fsPath);
  const fileHash = generateFileMD5(fsPath);
  const fileHashPath = path.normalize(
    PATH_PUBLIC_FILES +
      '/__generated_thumbs__' +
      '/' +
      fileHash +
      '_' +
      requestedWidth +
      '_' +
      requestedHeight +
      ext
  );

  if (fs.existsSync(fileHashPath)) {
    return sendFile(fileHashPath, res);
  }

  sharp(fsPath)
    .resize(requestedWidth, requestedHeight)
    .toFile(fileHashPath)
    .then((newFileInfo) => {
      return sendFile(fileHashPath, res);
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ status: 500, message: 'Failed to process image file!' })
        .send();
    });
};

/**
 * Generates a preview of a text file by cutting the initial head part
 * @param fsPath
 * @param req
 * @param res
 */
const generateTextFilePreview = (
  fsPath: string,
  req: express.Request,
  res: express.Response
) => {
  if (path.extname(fsPath) === '.pdf') {
    fs.readFile(fsPath, (err, data) => {
      res.setHeader(
        'Content-disposition',
        'inline; filename="' + path.basename(fsPath) + '"'
      );
      res.setHeader('Content-type', 'application/pdf');
      res.write(data);
      res.end();
    });
  } else {
    fs.readFile(fsPath, (err, data) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write(data);
      res.end();
    });
  }
};

/**
 * Sorts the fileStats by placing Directories first
 * @param fileStats
 */
const sortFileStatsByDirectory = (fileStats: FileStatInfo[]) => {
  fileStats.sort((a, b) => {
    if (!a.isDirectory && b.isDirectory) {
      return 1;
    } else if (a.isDirectory && !b.isDirectory) {
      return -1;
    }
    return 0;
  });
};

/**
 * Returns a list of detailed file and disk info regarding the file/folder
 * @param req
 * @param res
 */
export const getPathInfo = (req: express.Request, res: express.Response) => {
  const requestPath = req.params[0];
  const fsPath = getJailTranslatePath(requestPath);
  if (!fsPath) {
    return res
      .status(403)
      .json({ status: 403, message: 'You cannot access files outside of jail' })
      .send();
  }
  const fileStat = getFileStats(fsPath);
  if (!fileStat) {
    return res
      .status(404)
      .json({ status: 404, message: 'The path provided does not exist' })
      .send();
  }

  //Validate the outgoing data (type checking). Yes there are better ways...
  const formatResponse = (response: {
    status: number;
    message: string;
    data: FileListDataResponse;
  }) => {
    return response;
  };

  const createFileStatsEntry = (
    filePath: string,
    fileName: string,
    fileStats: fs.Stats
  ) => {
    return {
      name: fileName,
      path:
        requestPath.slice(-1) === '/'
          ? requestPath + fileName
          : requestPath + '/' + fileName,
      extension: (fileStats.isDirectory()
        ? ''
        : path.extname(fileName).length > 0
        ? path.extname(fileName).substring(1)
        : path.extname(fileName)
      ).toUpperCase(),
      mime: fileStats.isDirectory() ? '' : '' + mimeTypes.lookup(fileName),
      canPreview: fileStats.isDirectory()
        ? false
        : isImage(fileName) || isText(fileName),
      isDirectory: fileStats.isDirectory(),
      size: fileStats.isDirectory()
        ? getFolderFileSize(fsPath + '/' + fileName)
        : fileStats.size,
      modifiedTimeUTC: fileStats.mtime.getTime()
    };
  };

  if (fileStat.isDirectory()) {
    const fileNames = fs.readdirSync(fsPath);
    const filesStats: FileStatInfo[] = [];

    fileNames.forEach((fileName) => {
      const filePath = path.normalize(fsPath + '/' + fileName);
      const fileStats = fs.statSync(filePath);
      filesStats.push(createFileStatsEntry(filePath, fileName, fileStats));
    });
    sortFileStatsByDirectory(filesStats);
    return res
      .json(
        formatResponse({
          status: 200,
          message: 'Success!',
          data: {
            diskInfo: getDiskInfo(),
            files: filesStats
          }
        })
      )
      .send();
  } else if (fileStat.isFile()) {
    const fileName = path.basename(fsPath);
    const data = [createFileStatsEntry(fsPath, fileName, fileStat)];
    return res
      .json(
        formatResponse({
          status: 200,
          message: 'Success!',
          data: {
            diskInfo: getDiskInfo(),
            files: data
          }
        })
      )
      .send();
  }
};

/**
 * Sends the requested file to the client
 * @param req
 * @param res
 */
export const downloadFile = (req: express.Request, res: express.Response) => {
  const requestPath = req.params[0];
  const fsPath = getJailTranslatePath(requestPath);
  if (!fsPath) {
    return res
      .status(403)
      .json({ status: 403, message: 'You cannot access files outside of jail' })
      .send();
  }
  const fileStat = getFileStats(fsPath);
  if (!fileStat) {
    return res
      .status(404)
      .json({ status: 404, message: 'The path provided does not exist' })
      .send();
  }
  if (fileStat.isDirectory()) {
    return res
      .status(400)
      .json({ status: 400, message: 'You cannot download a directory!' })
      .send();
  }
  return sendFile(fsPath, res);
};

/**
 * Generates an on-the-fly zip file with the paths provided
 * @param req
 * @param res
 */
export const downloadGenerateZip = (
  req: express.Request,
  res: express.Response
) => {
  const queryObj = queryString.parse(req.params[0]);
  const requestLocation = '' + queryObj.location;
  if (!queryObj.fileNames || queryObj.fileNames.length < 1) {
    return res
      .status(403)
      .json({ status: 403, message: 'No filenames provided' })
      .send();
  }
  const requestFileNames: Array<string> = !Array.isArray(queryObj.fileNames)
    ? [queryObj.fileNames]
    : queryObj.fileNames;

  const fsPath = getJailTranslatePath(requestLocation);
  if (!fsPath) {
    return res
      .status(403)
      .json({ status: 403, message: 'Location is outside of jail' })
      .send();
  }
  const fileStat = getFileStats(requestLocation);
  if (!fileStat) {
    return res
      .status(404)
      .json({ status: 404, message: 'Location does not exist' })
      .send();
  }

  const realFiles: Array<string> = [];
  requestFileNames.forEach((fileName) => {
    const jailPath = getJailTranslatePath(requestLocation + '/' + fileName);
    if (!jailPath) {
      return;
    }
    const fileStat = getFileStats(jailPath);
    if (!fileStat) {
      return;
    }
    realFiles.push(jailPath);
  });

  if (realFiles.length !== requestFileNames.length) {
    return res
      .status(403)
      .json({
        status: 403,
        message: 'Aborted due to fileName argument escaping jail'
      })
      .send();
  }

  const zipName = 'generated.zip';
  res.attachment(zipName);

  const zip = archiver('zip', {
    zlib: { level: 0 } // Sets the compression level.
  });
  //Logging
  zip.on('close', () => console.log('Zipped ' + zip.pointer() + ' bytes'));
  zip.on('end', () => console.log('Reached end of stream'));
  zip.on('error', (err) => console.error(err));
  zip.on('warning', (err) => console.error(err));

  zip.pipe(res);

  realFiles.forEach((filePath, i) => {
    if (!getJailTranslatePath(filePath)) {
      return;
    }

    const fileStats = getFileStats(filePath);
    if (!fileStats) {
      return;
    }

    if (fileStats.isFile()) {
      zip.file(filePath, { name: requestFileNames[i] });
    } else if (fileStats.isDirectory()) {
      zip.directory(filePath, requestFileNames[i], {
        name: requestFileNames[i]
      });
    }
  });
  zip.finalize();
};
