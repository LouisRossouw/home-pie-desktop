// TODO; Move this file somewhere else ?

import { Setting } from './types'

const timestamp = Math.floor(Date.now() / 1000)

// prettier-ignore
export const defaultAppSettings = [
  {label: 'App start time',slug: 'app-start-time',key: 'appStartTime',value: timestamp},
  {label: 'App end time',slug: 'app-end-time',key: 'appEndTime',value: ''},
  {label: "Default start screen", slug: "start-route", key: "startRoute", value: undefined},
  { label: 'Theme', slug: 'theme', key: 'theme', value: 'light' },
  { label: 'Decimals', slug: 'decimals', key: 'decimals', value: 3 },
  { label: 'Debug', slug: 'debug', key: 'debug', value: false },
  { label: 'Lock screen', slug: 'lock-screen', key: 'lockScreen', value: true },
  { label: 'Auto start app', slug: 'auto-start', key: 'autoStart', value: true },
  { label: 'Notifications', slug: 'notifications', key: 'notifications', value: true },
  { label: 'Date format', slug: 'date-format', key: 'dateFormat', value: 'yyyy-MM-dd' },
  { label: 'App Width', slug: 'app-width', key: 'appWidth', value: 900 }, // ( Update the app width & height anytime the user changes width & height)
  { label: 'App Height', slug: 'app-height', key: 'appHeight', value: 670 }, // ^^^
  { label: 'App Window Mode', slug: 'app-window-mode', key: 'appWindowMode', value: undefined }
] as const

export const settingKeys = Object.fromEntries(defaultAppSettings.map((s) => [s.key, s.key])) as {
  [K in Setting]: K
}
