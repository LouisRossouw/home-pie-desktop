// TODO; Move this file somewhere else ?

import { CoreSetting, UserSetting } from './types'

const timestamp = Math.floor(Date.now() / 1000)

// prettier-ignore
export const defaultCoreSettings = [
  {label: 'Active account ID',slug: 'active-account-id',key: 'activeAccountId',value: 0},
  {label: 'App start time',slug: 'app-start-time',key: 'appStartTime',value: timestamp},
  {label: 'App end time',slug: 'app-end-time',key: 'appEndTime',value: ''},
  { label: 'Debug', slug: 'debug', key: 'debug', value: false },
  { label: 'Lock screen', slug: 'lock-screen', key: 'lockScreen', value: true },
  { label: 'Auto start app', slug: 'auto-start', key: 'autoStart', value: true },
  { label: 'App Width', slug: 'app-width', key: 'appWidth', value: 900 }, // ( Update the app width & height anytime the user changes width & height)
  { label: 'App Height', slug: 'app-height', key: 'appHeight', value: 670 }, // ^^^
  { label: 'App Window Mode', slug: 'app-window-mode', key: 'appWindowMode', value: undefined }
] as const

export const defaultUserSettings = [
  { label: 'Default start screen', slug: 'start-route', key: 'startRoute', value: undefined },
  { label: 'Theme', slug: 'theme', key: 'theme', value: 'light' },
  { label: 'Decimals', slug: 'decimals', key: 'decimals', value: 3 },
  { label: 'Notifications', slug: 'notifications', key: 'notifications', value: true },
  { label: 'Date format', slug: 'date-format', key: 'dateFormat', value: 'yyyy-MM-dd' }
] as const

export const coreSettingKeys = Object.fromEntries(
  defaultCoreSettings.map((s) => [s.key, s.key])
) as {
  [K in CoreSetting]: K
}

export const userSettingKeys = Object.fromEntries(
  defaultUserSettings.map((s) => [s.key, s.key])
) as {
  [K in UserSetting]: K
}

export const settingKeys = { ...coreSettingKeys, ...userSettingKeys }
