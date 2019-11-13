import axios, { AxiosError } from 'axios';
import { ACTION_TYPES, DispatchAction } from './reducer';
import { History } from 'history';
import queryString from 'query-string';

export const BASE_URL =
  window.location.protocol + '//' + window.location.hostname;
/*export const BASE_URL = 'http://localhost:3001';*/
/*export const BASE_URL = 'https://files.d3ff.se';*/

export const API_URL = BASE_URL + '/api';
export const loadPathData = (
  filePath: string,
  dispatch: (obj: DispatchAction) => void
) => {
  dispatch({
    type: ACTION_TYPES.SET_LOAD_NEW_LOCATION,
    payload: filePath
  });
  axios
    .get(generateFileListingURL(filePath))
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

const cleanUrl = (str: String) => {
  return str.replace(/\/\//g, '/');
};
export const pushNewHistoryLocation = (location: string, history: History) => {
  if (location.charAt(0) !== '/') {
    location = '/' + location;
  }
  history.push(location);
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
  fileNames: Array<string>
) => {
  return (
    API_URL + cleanUrl('/zip/' + queryString.stringify({ location, fileNames }))
  );
};
