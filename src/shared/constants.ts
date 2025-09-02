import { version } from '../../package.json'
import { getBaseURL } from './api'

export const defaultDotSquadColour = 'rgb(20, 20, 20)'

// const ENV = 'env'
// const env = process[ENV]

// const isDev = import.meta.env.DEV
// const isProd = import.meta.env.PROD
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
  signIn = 'sign-in'
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
export const getOauthRedirectUrl = `${getBaseURL()}/oauth/redirect`; // prettier-ignore
export const getAppWebsiteBaseURL = getBaseURL()

export const defaultProtocol = `homepie${isDevelopment() ? '-dev' : ''}`
