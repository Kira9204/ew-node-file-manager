export const BASE_URL =
  window.location.protocol + '//' + window.location.hostname;
/*
export const BASE_URL = 'http://localhost:3001';
 */

export const API_URL = BASE_URL + '/api';
export const LOCATION_LOGIN_KEY = 'location_login_storage';
export const LOCATION_LOGIN_MODIFY_KEY = 'location_login_modify_storage';
// If set to true, download links will use nginx/apache. If set to false, the nodeJs express backend will be
// used for downloads
export const USE_WEBSERVER = true;

// Enable this setting if you want the option to store the username/password
// as a global '/' path by default
export const SETTING_CHECK_PASS_GLOBAL = true;
export const SETTING_SHOW_MODIFY_BUTTONS = true;
export const TITLE_STR = '$D3FF file explorer';
export const VERSION = '1.2 2020-07-20--2';
