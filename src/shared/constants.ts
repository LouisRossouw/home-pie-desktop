export const defaultDotSquadColour = 'rgb(20, 20, 20)'

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
  checkAccessToken = 'check-access-token'
}

export enum SessionKey {
  accessToken = 'accessToken'
}
