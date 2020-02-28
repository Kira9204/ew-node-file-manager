import { useEffect, useRef } from 'react';

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
    isOpen: boolean;
    selectedFiles: null | File[];
    uploadPercent: number;
    statusCode: number;
    statusMessage: string;
    newFolderName: string;
  };
  deleteDialog: {
    isOpen: boolean;
    statusCode: number;
    statusMessage: string;
  };
  fileTable: {
    filesData: null | FileStatInfo[];
    currentSort: string;
    filePathIsReady: boolean;
    previewFileName: string;
    selectedFiles: string[];
    searchContains: string;
  };
  loginModifyTest: {
    username: string;
    password: string;
    showLoginError: boolean;
  };
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
    newFolderName: ''
  },
  deleteDialog: {
    isOpen: false,
    statusCode: 0,
    statusMessage: ''
  },
  fileTable: {
    filesData: null,
    currentSort: '',
    filePathIsReady: false,
    previewFileName: '',
    selectedFiles: [],
    searchContains: ''
  },
  loginModifyTest: {
    username: '',
    password: '',
    showLoginError: false
  }
};

//
// If you need to store parts of this store and compare between renders, use this.
//
export const usePreviousHook = (state: any) => {
  const ref = useRef();
  useEffect(() => {
    // @ts-ignore
    ref.current = state;
  }, [state]);
  return ref.current;
};

export const ACTION_TYPES = {
  SET_LOAD_NEW_LOCATION: 'SET_LOAD_NEW_LOCATION',
  SET_LOADING_NEW_LOCATION_FAILURE: 'SET_LOADING_NEW_LOCATION_FAILURE',
  SET_LOADED_NEW_LOCATION_DATA: 'SET_LOADED_NEW_LOCATION_DATA',
  SET_FILETABLE_UPDATED_SETTINGS: 'SET_FILETABLE_UPDATED_SETTINGS',
  SET_FILETABLE_SELECTED_FILES: 'SET_FILETABLE_SELECTED_FILES',
  SET_FILETABLE_PREVIEW_FILE: 'SET_FILETABLE_PREVIEW_FILE',
  SET_FILETABLE_SEARCH_CONTAINS: 'SET_FILETABLE_SEARCH_CONTAINS',
  SET_FILETABLE_SORT_BY: 'SET_FILETABLE_SORT_BY',
  OPEN_UPLOAD_DIALOG: 'OPEN_UPLOAD_DIALOG',
  SET_UPLOAD_DIALOG_FILES: 'SET_UPLOAD_DIALOG_FILES',
  SET_UPLOAD_DIALOG_PERCENT: 'SET_UPLOAD_DIALOG_PERCENT',
  SET_UPLOAD_DIALOG_NEW_FOLDER: 'SET_UPLOAD_DIALOG_NEW_FOLDER',
  SET_UPLOAD_DIALOG_ERROR: 'SET_UPLOAD_DIALOG_ERROR',
  CLOSE_UPLOAD_DIALOG: 'CLOSE_UPLOAD_DIALOG',
  OPEN_DELETE_DIALOG: 'OPEN_DELETE_DIALOG',
  SET_DELETE_DIALOG_ERROR: 'SET_DELETE_DIALOG_ERROR',
  CLOSE_DELETE_DIALOG: 'CLOSE_DELETE_DIALOG',
  SET_TEST_MODIFY_AUTH_USERNAME: 'SET_TEST_MODIFY_AUTH_USERNAME',
  SET_TEST_MODIFY_AUTH_PASSWORD: 'SET_TEST_MODIFY_AUTH_PASSWORD',
  SET_TEST_MODIFY_AUTH_SHOW_LOGIN_ERROR:
    'SET_TEST_MODIFY_AUTH_SHOW_LOGIN_ERROR',
  SET_TEST_MODIFY_AUTH_RESET: 'SET_TEST_MODIFY_AUTH_RESET'
};

export const reducer = (state: ApplicationState, action: DispatchAction) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOAD_NEW_LOCATION:
      return {
        ...state,
        statusCode: 0,
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
    case ACTION_TYPES.SET_FILETABLE_UPDATED_SETTINGS:
      return {
        ...state,
        fileTable: {
          ...state.fileTable,
          filesData: action.payload.filesData,
          currentSort: action.payload.currentSort,
          selectedFiles: action.payload.selectedFiles,
          filePathIsReady: true
        }
      };
    case ACTION_TYPES.SET_FILETABLE_SELECTED_FILES:
      return {
        ...state,
        fileTable: {
          ...state.fileTable,
          selectedFiles: action.payload
        }
      };
    case ACTION_TYPES.SET_FILETABLE_PREVIEW_FILE:
      return {
        ...state,
        fileTable: {
          ...state.fileTable,
          previewFileName: action.payload
        }
      };
    case ACTION_TYPES.SET_FILETABLE_SEARCH_CONTAINS:
      return {
        ...state,
        fileTable: {
          ...state.fileTable,
          searchContains: action.payload
        }
      };
    case ACTION_TYPES.SET_FILETABLE_SORT_BY:
      return {
        ...state,
        fileTable: {
          ...state.fileTable,
          currentSort: action.payload
        }
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
          statusMessage: ''
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
    case ACTION_TYPES.SET_UPLOAD_DIALOG_NEW_FOLDER:
      return {
        ...state,
        uploadDialog: {
          ...state.uploadDialog,
          newFolderName: action.payload
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
          newFolderName: ''
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
          statusMessage: ''
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
    case ACTION_TYPES.CLOSE_DELETE_DIALOG:
      return {
        ...state,
        deleteDialog: {
          isOpen: false,
          uploadPercent: 0,
          statusCode: 0,
          statusMessage: ''
        }
      };

    case ACTION_TYPES.SET_TEST_MODIFY_AUTH_USERNAME:
      return {
        ...state,
        loginModifyTest: {
          ...state.loginModifyTest,
          username: action.payload
        }
      };

    case ACTION_TYPES.SET_TEST_MODIFY_AUTH_PASSWORD:
      return {
        ...state,
        loginModifyTest: {
          ...state.loginModifyTest,
          password: action.payload
        }
      };

    case ACTION_TYPES.SET_TEST_MODIFY_AUTH_SHOW_LOGIN_ERROR:
      return {
        ...state,
        loginModifyTest: {
          ...state.loginModifyTest,
          showLoginError: action.payload
        }
      };

    case ACTION_TYPES.SET_TEST_MODIFY_AUTH_RESET:
      return {
        ...state,
        loginModifyTest: {
          username: '',
          password: '',
          showLoginError: false
        }
      };
    default:
      return state;
  }
};
