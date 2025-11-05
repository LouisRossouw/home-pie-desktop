import { version } from '../../package.json'
import { getOAuthClients } from './auth'
import { getRandomInteger } from './utils'

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

export enum dbIpcKey {
  // ** Core Settings
  getCoreSetting = 'get-setting',
  setCoreSetting = 'set-setting',
  getAllCoreSettings = 'get-all-settings',

  // ** User Settings
  getUserSetting = 'get-user-setting',
  setUserSetting = 'set-user-setting',
  deleteUserSettings = 'delete-user-settings',
  getAllUserSettings = 'get-all-user-settings',

  // ** Session
  getSession = 'get-session',
  setSession = 'set-session',
  getAllSessions = 'get-all-sessions',
  deleteUserSessions = 'delete-user-sessions',
  getAllUserSessions = 'get-all-user-sessions',
  getSessionByUserEmail = 'get-session-by-user-email',

  checkAccessToken = 'check-access-token',
  findNextActiveAccessToken = 'find-next-active-access-token',

  // ** Auth
  apiSignIn = 'api-sign-in'
}

export enum appIpcKey {
  loadApp = 'load-app',
  resizeApp = 'resize-app',
  maybeFastLoad = 'maybe-fast-load',
  loaderProgress = 'loader-progress',
  windowControl = 'window-control',
  windowResized = 'window-resized',
  navigateTo = 'navigate-to',
  openDirectory = 'open-directory',
  emitProcessActivity = 'emit-process-activity',
  openBrowserToUrl = 'open-browser-to-url',
  completeAuthApp = 'complete-auth-app',
  dotSquad = 'dot-squad',
  authCode = 'auth:code'
}

export enum externalIpcKey {
  apiMrPingPingStatus = 'api-mr-ping-ping-status',
  apiMrPingPingAppConfig = 'api-mr-ping-ping-app-config',
  apiMrPingPingAppsConfig = 'api-mr-ping-ping-apps-config',
  apiMrPingPingAppsStatus = 'api-mr-ping-ping-apps-status',
  apiMrPingPingAppStatus = 'api-mr-ping-ping-app-status',
  apiMrPingPingAppData = 'api-mr-ping-ping-apps-data',
  apiGenGenStart = 'api-gengen-start',
  apiGenGenCheckProgress = 'api-gengen-check-progress',
  apiProjectList = 'api-projects-list',
  apiGetProjectConfig = 'api-get-project-config',
  apiPutProjectConfig = 'api-put-project-config',
  apiTimeInProgressOverview = 'api-timeinprogress-overview',
  apiTimeInProgressInsertHistoricalData = 'api-timeinprogress-insert-historical-data',
  apiInstaInsightsGetAllAccounts = 'api-insta-insights-get-all-accounts',
  apiInstaInsightsGetAccountsOverview = 'api-insta-insights-get-accounts-overview',
  apiInstaInsightsAddAccount = 'api-insta-insights-add-account',
  apiInstaInsightsUpdateAccountStatus = 'api-insta-insights-update-account-status',
  apiInstaInsightsRemoveAccount = 'api-insta-insights-remove-account',
  apiCompleteAuthentication = 'api-complete-auth-app'
}

export enum navIpcKey {
  syncRoute = 'sync-route'
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
export const generatedUserId = getRandomInteger(1, 1000)

export const oAuthClients = getOAuthClients()

export const DEBOUNCE_MILLIS = 100

// Oauth redirect URL
export const getAppName = 'HomePie'

export const getApiBaseURL = isDev ? devApiBaseUrl : prodApiBaseUrl // API
export const getWebBaseURL = isDev ? devWebBaseUrl : prodWebBaseUrl // The public-facing site
export const getAppBaseURL = isDev ? devAppBaseUrl : prodAppBaseUrl // App site, docs, auth, maybe the actual app too.
export const getOauthRedirectUrl = `${getAppBaseURL}/oauth/redirect`; // prettier-ignore
export const getWebSupportUrl = `${getAppBaseURL}/support`
export const getWebDashboardUrl = `${getAppBaseURL}/dashboard`

export const appOriginName = `${getAppName.toLowerCase()}-desktop-app`
export const defaultProtocol = `homepie${isDevelopment() ? '-dev' : ''}`
