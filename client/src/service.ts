import axios, { AxiosError } from 'axios';
import { ACTION_TYPES, DispatchAction } from './reducer';
import { History } from 'history';
import queryString from 'query-string';
import { API_URL, BASE_URL, LOCATION_LOGIN_KEY } from './constants';

export interface StoredAuth {
  path: string;
  username: string;
  password: string;
}

export const getAuthForPath = (path: string) => {
  const stored = localStorage.getItem(LOCATION_LOGIN_KEY)
    ? localStorage.getItem(LOCATION_LOGIN_KEY)
    : '[]';
  const storedArr: StoredAuth[] = JSON.parse('' + stored);
  return storedArr.find((e) => path.startsWith(e.path));
};

export const loadPathData = (
  filePath: string,
  dispatch: (obj: DispatchAction) => void
) => {
  const auth = getAuthForPath(filePath);
  const axiosAuth = auth
    ? {
        auth: {
          username: auth.username,
          password: auth.password
        }
      }
    : {};

  dispatch({
    type: ACTION_TYPES.SET_LOAD_NEW_LOCATION,
    payload: filePath
  });
  axios
    .get(generateFileListingURL(filePath), axiosAuth)
    .then((res) => {
      dispatch({
        type: ACTION_TYPES.SET_LOADED_NEW_LOCATION_DATA,
        payload: {
          statusCode: res.status,
          statusText: res.statusText,
          pathData: res.data.data
        }
      });
    })
    .catch((err: AxiosError) => {
      console.error('API ERROR!', err);
      dispatch({
        type: ACTION_TYPES.SET_LOADING_NEW_LOCATION_FAILURE,
        payload: {
          statusCode: err.response ? err.response.status : -1,
          statusMessage: err.response
            ? err.response.statusText
            : 'Could not connect to server!'
        }
      });
    });
};

export const cleanUrl = (str: String) => {
  return str.replace(/\/\//g, '/');
};
export const pushNewHistoryLocation = (location: string, history: History) => {
  if (location.charAt(0) !== '/') {
    location = '/' + location;
  }
  history.push(cleanUrl(location));
};
export const generateFileListingURL = (fileItemPath: string) => {
  return API_URL + cleanUrl('/path/' + fileItemPath);
};
export const generatePreviewURL = (fileItemPath: string) => {
  return API_URL + cleanUrl('/preview/' + fileItemPath);
};
export const generateDownloadURL = (fileItemPath: string) => {
  /*
   * Use the following link for node.js downloads
   *  return API_URL+cleanUrl('/download/'+fileItemPath);
   * Use the following link for nginx downloads
   *  BASE_URL + cleanUrl('/download/' + fileItemPath);
   */
  return BASE_URL + cleanUrl('/download/' + fileItemPath);
};

export const generateZIPDownloadURL = (
  location: string,
  fileNames: string[]
) => {
  return (
    API_URL + cleanUrl('/zip/' + queryString.stringify({ location, fileNames }))
  );
};

export const generateUploadURL = (path: string) => {
  return API_URL + cleanUrl('/upload/' + path);
};

export const generateDeleteURL = (location: string, fileNames: string[]) => {
  return (
    API_URL +
    cleanUrl('/delete/' + queryString.stringify({ location, fileNames }))
  );
};
