import axios, { AxiosError } from 'axios';
import { ACTION_TYPES, DispatchAction } from './reducer';
import { History } from 'history';
import queryString from 'query-string';
import {
  API_URL,
  BASE_URL,
  LOCATION_LOGIN_KEY,
  SETTING_CHECK_PASS_GLOBAL
} from './constants';

export interface StoredAuth {
  location: string;
  auth: string;
}

/**
 * If the user has keys in old or invalid formats they need to re-create the keys.
 */
export const authCleanUp = () => {
  const stored = localStorage.getItem(LOCATION_LOGIN_KEY)
    ? localStorage.getItem(LOCATION_LOGIN_KEY)
    : '[]';
  const storedArr: StoredAuth[] = JSON.parse('' + stored);
  if (storedArr.length === 0) {
    return false;
  }

  let hasInvalid = false;
  for (let i = 0; i < storedArr.length; i++) {
    const obj = storedArr[i];
    if (!obj.auth || !obj.location) {
      hasInvalid = true;
      break;
    }
  }

  if (hasInvalid) {
    localStorage.removeItem(LOCATION_LOGIN_KEY);
    return true;
  }
  return false;
};

/**
 * Adds a new key to a location, and replaces keys with the same location
 * @param location
 * @param username
 * @param password
 */
export const authStoreNew = (
  location: string,
  username: string,
  password: string
) => {
  const storeObj = { location, auth: window.btoa(username + ':' + password) };
  const stored = localStorage.getItem(LOCATION_LOGIN_KEY)
    ? localStorage.getItem(LOCATION_LOGIN_KEY)
    : '[]';
  const storedArr: StoredAuth[] = JSON.parse('' + stored);
  const storedArrFiltered = storedArr.filter((e) => e.location !== location);

  storedArrFiltered.push(storeObj);
  localStorage.setItem(LOCATION_LOGIN_KEY, JSON.stringify(storedArrFiltered));

  return storedArrFiltered;
};

/**
 * Removes a location from the auth arr
 * @param location
 */
export const removeAuthForLocation = (location: string) => {
  const stored = localStorage.getItem(LOCATION_LOGIN_KEY)
    ? localStorage.getItem(LOCATION_LOGIN_KEY)
    : '[]';
  const storedArr: StoredAuth[] = JSON.parse('' + stored);
  let filteredAuth = storedArr.filter((e) => e.location !== location);
  if (SETTING_CHECK_PASS_GLOBAL) {
    filteredAuth = filteredAuth.filter((e) => e.location !== '/');
  }

  localStorage.setItem(LOCATION_LOGIN_KEY, JSON.stringify(filteredAuth));
  return filteredAuth;
};

/**
 * Retrieves authentication for a URI location.
 * Since configurations tend to have just a '/' for auth,
 * And paths tends to be '/asd/d', we will also try the fist entry we find
 * @param location A URI path.
 * @param ignorePath If the path isn't found, try whatever is in the store.
 */
export const getAuthForPath = (
  location: string,
  ignorePath: boolean = false
) => {
  if (authCleanUp()) {
    return null;
  }

  const stored = localStorage.getItem(LOCATION_LOGIN_KEY)
    ? localStorage.getItem(LOCATION_LOGIN_KEY)
    : '[]';
  const storedArr: StoredAuth[] = JSON.parse('' + stored);
  const found = storedArr.find((e) => location.startsWith(e.location));
  if (found) {
    return found;
  }
  if (ignorePath && storedArr.length > 0) {
    return storedArr[0];
  }
  return null;
};

/**
 * Adds a basic auth header to axios
 * @param authStr
 */
export const addAuthHeader = (authStr: string) => {
  return {
    headers: {
      Authorization: 'Basic ' + authStr
    }
  };
};

export const loadPathData = (
  filePath: string,
  dispatch: (obj: DispatchAction) => void
) => {
  const authObj = getAuthForPath(filePath, true);
  const axiosAuth = authObj ? addAuthHeader(authObj.auth) : {};

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
