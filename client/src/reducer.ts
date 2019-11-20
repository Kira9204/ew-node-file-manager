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
  uploadDialog: {
    isOpen: boolean,
    selectedFiles: null | File[],
    uploadPercent: number,
    statusCode: number,
    statusMessage: string,
    userName: string,
    password: string
  },
  deleteDialog: {
    isOpen: boolean,
    statusCode: number,
    statusMessage: string,
    userName: string,
    password: string
  },
  selectedFiles: string[]
}

export interface DispatchAction {
  type: string;
  payload?: any;
}

export const initialApplicationState: ApplicationState = {
  statusCode: 0,
  statusMessage: '',
  pathData: null,
  fsLocation: window.location.pathname,
  uploadDialog: {
    isOpen: false,
    selectedFiles: null,
    uploadPercent: 0,
    statusCode: 0,
    statusMessage: '',
    userName: '',
    password: ''
  },
  deleteDialog: {
    isOpen: false,
    statusCode: 0,
    statusMessage: '',
    userName: '',
    password: ''
  },
  selectedFiles: []
};
export const ACTION_TYPES = {
  SET_LOAD_NEW_LOCATION: 'SET_LOAD_NEW_LOCATION',
  SET_LOADING_NEW_LOCATION_FAILURE: 'SET_LOADING_NEW_LOCATION_FAILURE',
  SET_LOADED_NEW_LOCATION_DATA: 'SET_LOADED_NEW_LOCATION_DATA',
  SET_SELECTED_FILES: 'SET_SELECTED_FILES',
  OPEN_UPLOAD_DIALOG: 'OPEN_UPLOAD_DIALOG',
  SET_UPLOAD_DIALOG_FILES: 'SET_UPLOAD_DIALOG_FILES',
  SET_UPLOAD_DIALOG_PERCENT: 'SET_UPLOAD_DIALOG_PERCENT',
  SET_UPLOAD_DIALOG_USERNAME: 'SET_UPLOAD_DIALOG_USERNAME',
  SET_UPLOAD_DIALOG_PASSWORD: 'SET_UPLOAD_DIALOG_PASSWORD',
  SET_UPLOAD_DIALOG_ERROR: 'SET_UPLOAD_DIALOG_ERROR',
  CLOSE_UPLOAD_DIALOG: 'CLOSE_UPLOAD_DIALOG',
  OPEN_DELETE_DIALOG: 'OPEN_DELETE_DIALOG',
  SET_DELETE_DIALOG_USERNAME: 'SET_DELETE_DIALOG_USERNAME',
  SET_DELETE_DIALOG_PASSWORD: 'SET_DELETE_DIALOG_PASSWORD',
  SET_DELETE_DIALOG_ERROR: 'SET_DELETE_DIALOG_ERROR',
  CLOSE_DELETE_DIALOG: 'CLOSE_DELETE_DIALOG',
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
    case ACTION_TYPES.OPEN_UPLOAD_DIALOG:
      return {
        ...state,
        uploadDialog: {
          ...state.uploadDialog,
          isOpen: true,
          selectedFiles: null,
          uploadPercent: 0,
          statusCode: 0,
          statusMessage: '',
          userName: '',
          password: ''
        }
      };
    case ACTION_TYPES.SET_UPLOAD_DIALOG_FILES:
      return {
        ...state,
        uploadDialog: {
          ...state.uploadDialog,
          selectedFiles: action.payload,
          uploadPercent: 0
        }
      };
    case ACTION_TYPES.SET_UPLOAD_DIALOG_PERCENT:
      return {
        ...state,
        uploadDialog: {
          ...state.uploadDialog,
          uploadPercent: action.payload
        }
      };
    case ACTION_TYPES.SET_UPLOAD_DIALOG_USERNAME:
      return {
        ...state,
        uploadDialog: {
          ...state.uploadDialog,
          userName: action.payload
        }
      };
    case ACTION_TYPES.SET_UPLOAD_DIALOG_PASSWORD:
      return {
        ...state,
        uploadDialog: {
          ...state.uploadDialog,
          password: action.payload
        }
      };
    case ACTION_TYPES.SET_UPLOAD_DIALOG_ERROR:
      return {
        ...state,
        uploadDialog: {
          ...state.uploadDialog,
          uploadPercent: 0,
          statusCode: action.payload.statusCode,
          statusMessage: action.payload.statusMessage
        }
      };
    case ACTION_TYPES.CLOSE_UPLOAD_DIALOG:
      return {
        ...state,
        uploadDialog: {
          isOpen: false,
          selectedFiles: null,
          uploadPercent: 0,
          statusCode: 0,
          statusMessage: '',
          userName: '',
          password: ''
        }
      };
    case ACTION_TYPES.OPEN_DELETE_DIALOG:
      return {
        ...state,
        deleteDialog: {
          ...state.deleteDialog,
          isOpen: true,
          uploadPercent: 0,
          statusCode: 0,
          statusMessage: '',
          userName: '',
          password: ''
        }
      };
    case ACTION_TYPES.SET_DELETE_DIALOG_ERROR:
      return {
        ...state,
        deleteDialog: {
          ...state.deleteDialog,
          statusCode: action.payload.statusCode,
          statusMessage: action.payload.statusMessage
        }
      };
    case ACTION_TYPES.SET_DELETE_DIALOG_USERNAME:
      return {
        ...state,
        deleteDialog: {
          ...state.deleteDialog,
          userName: action.payload
        }
      };
    case ACTION_TYPES.SET_DELETE_DIALOG_PASSWORD:
      return {
        ...state,
        deleteDialog: {
          ...state.deleteDialog,
          password: action.payload
        }
      };
    case ACTION_TYPES.CLOSE_DELETE_DIALOG:
      return {
        ...state,
        deleteDialog: {
          isOpen: false,
          uploadPercent: 0,
          statusCode: 0,
          statusMessage: '',
          userName: '',
          password: ''
        }
      };
    default:
      return state;
  }
};
