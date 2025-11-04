// TODO; Maybe switch to open-api, to generate api response types from my server.

import { IpcRendererEvent } from 'electron'
import { defaultCoreSettings, defaultUserSettings } from './default-app-settings'
import { components } from './lib/generated/api'
import { DotSquadAnims } from './dot-squad'

export type Schemas = components['schemas']

type CustomTokenResponse = Schemas['CustomTokenResponse'] & { application: string } // TODO; Fix this extra type

export type Project = {
  title: string
  slug: string
  img?: string
  url: string
}

export type CoreSetting = (typeof defaultCoreSettings)[number]['key']
export type UserSetting = (typeof defaultUserSettings)[number]['key']
export type Setting = CoreSetting | UserSetting

export type WindowBaseActions = 'minimize' | 'maximize' | 'close' | 'login'
export type WindowModes = 'sidebar-left' | 'bottom-left' | 'default'

export type WindowControl = {
  action: WindowBaseActions | WindowModes
  width?: number
  height?: number
}

export type OnResize = {
  x: number
  y: number
  width: number
  height: number
  hasMoved?: boolean
  isMoving?: boolean
}

// **
// **
// **
// ** API Related Types;

export type Range = 'hour' | 'day' | 'week' | 'month' | 'year'

export type ApiTest = { ok: boolean; data?: any }

export type ApiProjectsList = { ok: boolean; data?: Project[] }

export type SocialData = {
  account: string
  to_date: string
  latest_post_value: number
  latest_followers: number
  from_date: string
  past_post_value: number
  past_followers_value: number
  post_difference: number
  followers_difference: number
  average_per_10_min: number
  average_per_1_hour: number
  average_per_1_day: number
  average_per_1_week: number
  average_per_1_month: number
  platform: Platforms
}

export type Social = {
  data: SocialData
  historical: SocialData[]
}

export type ApiTimeInProgressOverview = { account: string; range: Range; interval: number }

export type ApiTimeInProgressOverviewResponse = {
  db_elapsed_time: number
  ok: boolean
  datetime: string
  instagram: Social
  youtube: Social
  tiktok: Social
  bluesky: Social
  twitter: Social
}

export type ApiInstaInsightsAccountsOverview = {
  accounts: string[]
  range: Range
  interval: number
  platform: string
}

export type ApiInstaInsightsAccount = { account: string; active: boolean }

export type ApiInstaInsightsAccountsOverviewResponse = {
  ok: true
  datetime: string
  db_elapsed_time: string
  data: SocialData
  historical: SocialData[]
}

export type AccountsDataWithPic = SocialData & {
  profile_picture_url: string
  historical: any[]
  active: boolean
}

export type ApiTimeInProgressInsertHistoricalData = {
  platform: Platforms
  // # Instagram & Bluesky & X-Twitter
  followers: number
  following: number
  // posts: number

  // // TikTok
  likes: number

  // // YouTube
  // videos?: number
  // subscribers?: number
  // views?: number
}

export type ApiMrPingPingStatus = {
  ok: boolean
  date: string
  res_time: number
  last_pinged: string
  db_elapsed_time: number
}

export type Platforms = 'instagram' | 'tiktok' | 'x-twitter' | 'youtube' | 'bluesky'

export type SessionAccess = {
  active: boolean
  accessToken: string
  refreshToken: string
  expiresIn: number
  expires: string
  application: string
}

type UserSession = Schemas['CustomUser']

export type UserSessionKey = keyof UserSession
export type SessionAccessKey = keyof SessionAccess

// **
// **
// **
// ** SQL Related Types;
export type SessionsSQL = {
  userId: string
  key: any
  value: any
}

// prettier-ignore
export type GetSession = {userId: number | string, key: UserSessionKey | SessionAccessKey}
export type GetSessionByUserEmail = { userEmail: string }
export type SetSession = { userId: number | string; key: string; value: string | number | boolean }
export type DeleteUserSessions = { userId: number | string }
export type GetAllUserSessions = { userId: number | string }

export type GetCoreSetting = { key: CoreSetting }
export type SetCoreSetting = { key: Setting; value?: string | number | boolean }
export type GetUserSetting = { userId: number | string; key: UserSetting }
export type DeleteUserSettings = { userId: number | string }

// prettier-ignore
export type SetUserSetting = {userId: number | string; key: UserSetting; value: string | number | boolean}
export type GetAllUserSettings = { userId: number | string }

export type CheckAccessToken = { userId: number; accessToken?: string }

// Returned types
export type ResGetCoreSetting = Promise<string | undefined>
export type ResGetAllCoreSettings = Promise<Record<string, string>[]>
export type ResGetUserSetting = Promise<string | undefined>
export type ResGetAllUserSettings = Promise<Record<string, string>[]>
export type ResgetAllSessions = Promise<SessionsSQL[]>
export type ResGetSessionByUserEmail = Promise<SessionsSQL | undefined>
export type ResDeleteUserSessions = Promise<boolean>
export type ResGetAllUserSessions = Promise<Record<string, unknown>>
export type ResCheckAccessToken = Promise<string | undefined>
export type ResGetSession = Promise<string | undefined>
export type ResFindNextActiveAccessToken = Promise<
  { userId: number; accessToken: string } | undefined
>

// **
// **
// **
// ** appApi Types;
export type ResizeApp = {
  width: number
  height: number
  save?: boolean
}
export type LoadApp = { fastLoad: boolean }
export type OpenDirectory = { path: string }
export type OpenBrowserToUrl = { url: string }
export type AuthCode = { code: string } // TODO; Fix this.
export type ApiCompleteAuth = { loginKey: string }
export type UpdateDotSquad = { activity: DotSquadAnims }
export type ApiSignIn = { addAccount?: boolean }

// Returned types
export type ResLoadApp = Promise<{ hasLoaded: boolean; isFirstLoad: boolean }>
export type ResMaybeFastLoad = Promise<{ skipSplash: boolean; skipLoader: boolean }>
export type OnLoaderProgressHandler = (event: IpcRendererEvent, args: { msg: string }) => void
export type OnWindowResizeHandler = (event: IpcRendererEvent, v: OnResize) => void
export type UpdateDotSquadHandler = (event: IpcRendererEvent, v: UpdateDotSquad) => void
export type EmitProcessActivityHandler = (event: IpcRendererEvent, v: { activity: string }) => void
export type OnAuthCodeHandler = (event: IpcRendererEvent, v: AuthCode) => void

// *
// **
// ***
// Preloader function types;

// - AppAPI - func types
export type ResizeAppFunc = (v: ResizeApp) => void
export type LoadAppFunc = (v: LoadApp) => ResLoadApp
export type MaybeFastLoadFunc = () => ResMaybeFastLoad
export type WindowControlFunc = (v: WindowControl) => Promise<string>
export type ListenerCountFunc = (v: string) => Promise<string>
export type RemoveAllListenersFunc = (v: any) => Promise<any>
export type RemoveListenerFunc = (v: any, listener: string) => Promise<any>
export type OpenDirectoryFunc = (v: OpenDirectory) => void
export type OpenBrowserToUrlFunc = (v: OpenBrowserToUrl) => void
export type ApiCompleteAuthenticationFunc = (v: ApiCompleteAuth) => Promise<CustomTokenResponse>
export type ApiSignInFunc = (v: ApiSignIn) => void
export type OnAuthCodeFunc = (handler: OnAuthCodeHandler) => void
export type OnLoaderProgressFunc = (handler: OnLoaderProgressHandler) => void
export type EmitProcessActivityFunc = (handler: EmitProcessActivityHandler) => void
export type OnWindowResizeFunc = (handler: OnWindowResizeHandler) => Promise<any>
export type UpdateDotSquadFunc = (handler: UpdateDotSquadHandler) => Promise<any>

// - DatabaseAppSettingsAPI - func types
export type SetCoreSettingFunc = (v: SetCoreSetting) => void
export type GetAllCoreSettingsFunc = () => ResGetAllCoreSettings
export type GetCoreSettingFunc = (v: GetCoreSetting) => ResGetCoreSetting
export type SetUserSettingFunc = (v: SetUserSetting) => void
export type GetUserSettingFunc = (v: GetUserSetting) => ResGetUserSetting
export type GetAllUserSettingsFunc = (v: GetAllUserSettings) => ResGetAllUserSettings
export type SetSessionFunc = (v: SetSession) => void
export type GetAllSessionsFunc = () => ResgetAllSessions
export type GetSessionFunc = (v: GetSession) => ResGetSession
export type DeleteUserSessionsFunc = (v: DeleteUserSessions) => ResDeleteUserSessions
export type GetSessionByUserEmailFunc = (v: GetSessionByUserEmail) => ResGetSessionByUserEmail
export type GetAllUserSessionsFunc = (v: GetAllUserSessions) => ResGetAllUserSessions
export type CheckAccessTokenFunc = (v: CheckAccessToken) => ResCheckAccessToken
export type FindNextActiveAccessTokenFunc = () => ResFindNextActiveAccessToken

// - External API
export type ApiMrPingPingAppConfig = { appName: string }
export type ApiMrPingPingAppStatus = { appName: string }
export type ApiMrPingPingAppData = { appName: string; range: string; interval: number }
export type ApiGenGenStart = { project: string }
export type ApiGenGenCheckProgress = { project: string }
export type ApiGetProjectConfig = { project: string }
export type ApiPutProjectConfig = { project: string; config: Schemas['Config'] }

// - External API - func types
export type ApiMrPingPingStatusFunc = () => Promise<ApiMrPingPingStatus>
export type ApiMrPingPingAppConfigFunc = (v: ApiMrPingPingAppConfig) => Promise<any>
export type ApiMrPingPingAppsConfigFunc = () => Promise<any>
export type ApiMrPingPingAppsStatusFunc = () => Promise<any>
export type ApiMrPingPingAppStatusFunc = (
  v: ApiMrPingPingAppStatus
) => Promise<{ ok: boolean; data: unknown }>
export type ApiMrPingPingAppDataFunc = (v: {
  appName: string
  range: string
  interval: number
}) => Promise<{ ok: boolean; data: unknown }>

export type ApiGenGenCheckProgressFunc = (v: ApiGenGenCheckProgress) => Promise<any>
export type ApiGenGenStartFunc = (v: ApiGenGenStart) => Promise<any>
export type ApiProjectListFunc = () => Promise<ApiProjectsList>
export type ApiGetProjectConfigFunc = (v: ApiGetProjectConfig) => Promise<any>
export type ApiPutProjectConfigFunc = (v: ApiPutProjectConfig) => Promise<boolean>
export type ApiTimeInProgressOverviewFunc = (
  v: ApiTimeInProgressOverview
) => Promise<ApiTimeInProgressOverviewResponse>
export type ApiTimeInProgressInsertHistoricalDataFunc = (
  v: ApiTimeInProgressInsertHistoricalData
) => Promise<{ ok: boolean }>
export type ApiInstaInsightsGetAllAccountsFunc = () => Promise<{
  ok: boolean
  data: ApiInstaInsightsAccount[]
}>
export type ApiInstaInsightsGetAccountsOverviewFunc = (
  data: ApiInstaInsightsAccountsOverview
) => Promise<ApiInstaInsightsAccountsOverviewResponse>
export type ApiInstaInsightsAddAccountFunc = (
  v: ApiInstaInsightsAccount
) => Promise<{ ok: boolean }>
export type ApiInstaInsightsUpdateAccountStatusFunc = (
  v: ApiInstaInsightsAccount
) => Promise<{ ok: boolean }>
export type ApiInstaInsightsRemoveAccountFunc = (
  v: ApiInstaInsightsAccount
) => Promise<{ ok: boolean }>
// ***
// **
// *
