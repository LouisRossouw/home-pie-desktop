// TODO; Maybe switch to open-api, to generate api response types from my server.

import { defaultCoreSettings, defaultUserSettings } from './default-app-settings'
import { components } from './lib/generated/api'

export type Schemas = components['schemas']

export type Project = {
  title: string
  slug: string
  img?: string
  url: string
}

export type CoreSetting = (typeof defaultCoreSettings)[number]['key']
export type UserSetting = (typeof defaultUserSettings)[number]['key']
export type Setting = CoreSetting | UserSetting

export type ResizeApp = {
  width: number
  height: number
  save?: boolean
}

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
