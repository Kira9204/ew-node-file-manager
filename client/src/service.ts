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

/**
 * Retrieves authentication for a URI location.
 * Since configurations tend to have just a '/' for auth,
 * And paths tends to be '/asd/d', we will also try the fist entry we find
 * @param path A URI path.
 * @param ignorePath If the path isn't found, try whatever is in the store.
 */
export const getAuthForPath = (path: string, ignorePath: boolean = false) => {
  const stored = localStorage.getItem(LOCATION_LOGIN_KEY)
    ? localStorage.getItem(LOCATION_LOGIN_KEY)
    : '[]';
  const storedArr: StoredAuth[] = JSON.parse('' + stored);
  const found = storedArr.find((e) => path.startsWith(e.path));
  if (found) {
    return found;
  }
  if (ignorePath && storedArr.length > 0) {
    return storedArr[0];
  }
  return null;
};

export const loadPathData = (
  filePath: string,
  dispatch: (obj: DispatchAction) => void
) => {
  const auth = getAuthForPath(filePath, true);
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
  let newStr = str.replace(/\/\//g, '/');
  if (newStr.charAt(0) !== '/') {
    newStr = '/' + newStr;
  }
  if (str.slice(-1) === '/') {
    newStr = newStr.substring(0, newStr.length - 1);
  }
  return newStr;
};
export const pushNewHistoryLocation = (location: string, history: History) => {
  history.push(cleanUrl(location));
};
export const generateFileListingURL = (fileItemPath: string) => {
  return API_URL + cleanUrl('/path/' + fileItemPath + '/');
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
