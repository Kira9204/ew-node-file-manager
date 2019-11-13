export interface FileStatInfo {
  name: string;
  path: string;
  extension: string;
  mime: string;
  canPreview: string;
  isDirectory: boolean;
  size: number;
  modifiedTimeUTC: number;
}

export interface DiskInfo {
  available: number;
  free: number;
  total: number;
}

export interface FileListDataResponse {
  diskInfo: DiskInfo;
  files: FileStatInfo[];
}

export interface ApplicationState {
  statusCode: number;
  statusMessage: string;
  pathData: null | FileListDataResponse;
  fsLocation: string;
}

export interface DispatchAction {
  type: string;
  payload?: any;
}

export const initialApplicationState: ApplicationState = {
  statusCode: 0,
  statusMessage: '',
  pathData: null,
  fsLocation: window.location.pathname
};
export const ACTION_TYPES = {
  SET_LOAD_NEW_LOCATION: 'SET_LOAD_NEW_LOCATION',

  SET_LOADING_NEW_LOCATION_FAILURE: 'SET_LOADING_NEW_LOCATION_FAILURE',
  SET_LOADED_NEW_LOCATION_DATA: 'SET_LOADED_NEW_LOCATION_DATA'
};

export const reducer = (state: ApplicationState, action: DispatchAction) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOAD_NEW_LOCATION:
      return {
        ...state,
        fsLocation: action.payload
      };
    case ACTION_TYPES.SET_LOADING_NEW_LOCATION_FAILURE:
      return {
        ...state,
        statusCode: action.payload.statusCode,
        statusMessage: action.payload.statusMessage,
        pathData: null
      };
    case ACTION_TYPES.SET_LOADED_NEW_LOCATION_DATA:
      return {
        ...state,
        statusCode: action.payload.statusCode,
        statusMessage: action.payload.statusMessage,
        pathData: action.payload.pathData
      };
    default:
      return state;
  }
};
