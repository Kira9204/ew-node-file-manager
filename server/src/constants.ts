import path from 'path';

export const PATH_PUBLIC_FILES = path.join(__dirname, '../../public-files');
export const PATH_WEBPACK_BUILD = path.join(__dirname, '../../webpack-build');
export const PATH_GENERATED_THUMBS = path.join(
  __dirname,
  '../../generated-thumbs'
);
export const PATH_TMP_UPLOAD = path.join(__dirname, '../../tmp-upload');

export interface AUTH_DIR {
  path: string;
  user: string;
  password: string;
}

// If you have a _LOT_ of large files you might want to disable this option.
// This will remove the recursive lookup of folder sizes.
export const SETTING_SHOULD_FILESTAT_FOLDERS = false;

// Add filenames that you don't want listed here
export const SETTING_IGNORE_NAMES = ['$RECYCLE.BIN'];

/*
  Certain folders can require a BASIC AUTH in order to stat files.
  The format is in the following format: [ {user: string, password: string, location: string}]
  Paths should not start with, or end with '/', as these will be stripped when the location is cleaned.
  Sub-folders of the specified path will also require the same password
  Setting this variable to an empty array disables the feature.

  Note: This does NOT prevent users from downloading files if they know the path!
  If you need download auth lockdown, look into nginx basic auth and disable previews for locked folders!
 */

export const AUTH_FILESTATS: AUTH_DIR[] = [];
export const AUTH_MODIFY: AUTH_DIR[] = [];
