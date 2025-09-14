import { version } from '../../package.json'
import { getBaseURL } from './api'

const devApiBaseUrl = import.meta.env.VITE_DEV_API_BASEURL
const prodApiBaseUrl = import.meta.env.VITE_PROD_API_BASEURL

const devAppBaseUrl = import.meta.env.VITE_DEV_APP_BASEURL
const prodAppBaseUrl = import.meta.env.VITE_PROD_APP_BASEURL

const devWebBaseUrl = import.meta.env.VITE_DEV_WEB_BASEURL
const prodWebBaseUrl = import.meta.env.VITE_PROD_WEB_BASEURL

// Vite is filtering out process.env variables that are not prefixed with VITE_.
// const ENV = 'env'
// const env = process[ENV]

export const defaultDotSquadColour = 'rgb(20, 20, 20)'

// const ENV = 'env'
// const env = process[ENV]

const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD
const appEnvironment = import.meta.env.MODE // development || production

export enum IpcKey {
  // ** Core Settings
  getCoreSetting = 'get-setting',
  setCoreSetting = 'set-setting',
  getAllCoreSettings = 'get-all-settings',

  // ** User Settings
  getUserSetting = 'get-user-setting',
  setUserSetting = 'set-user-setting',
  getAllUserSettings = 'get-all-user-settings',

  // ** Session
  getSession = 'get-session',
  setSession = 'set-session',
  getAllSessions = 'get-all-sessions',
  checkAccessToken = 'check-access-token',

  // ** Auth
  apiSignIn = 'api-sign-in'
}

export enum SessionKey {
  accessToken = 'accessToken'
}
export const getAppVersion = () => version
export const getAppPlatform = () => process.platform
export const isMac = () => getAppPlatform() === 'darwin'
export const isLinux = () => getAppPlatform() === 'linux'
export const isWindows = () => getAppPlatform() === 'win32'
export const isDevelopment = () => appEnvironment === 'development'
// export const getAppBuildDate = () => new Date(import.meta.env.VITE_BUILD_DATE ?? '').toLocaleDateString(); // prettier-ignore

export const DEBOUNCE_MILLIS = 100

// Oauth redirect URL
export const getAppName = 'HomePie'

export const getApiBaseURL = isDev ? devApiBaseUrl : prodApiBaseUrl // API
export const getWebBaseURL = isDev ? devWebBaseUrl : prodWebBaseUrl // The public-facing site
export const getAppBaseURL = isDev ? devAppBaseUrl : prodAppBaseUrl // App site, docs, auth, maybe the actual app too.
export const getOauthRedirectUrl = `${getAppBaseURL}/oauth/redirect`; // prettier-ignore

export const appOriginName = `${getAppName.toLowerCase()}-desktop-app`
export const defaultProtocol = `homepie${isDevelopment() ? '-dev' : ''}`
