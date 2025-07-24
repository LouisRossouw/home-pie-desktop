// TODO; Move this file somewhere else ?

export const defaultAppSettings = [
  { label: 'Theme', slug: 'theme', key: 'theme', value: 'light' },
  { label: 'Decimals', slug: 'decimals', key: 'decimals', value: 3 },
  { label: 'Debug', slug: 'debug', key: 'debug', value: false },
  { label: 'Lock screen', slug: 'lock-screen', key: 'lockScreen', value: true },
  { label: 'Auto start app', slug: 'auto-start', key: 'autoStart', value: true },
  { label: 'Notifications', slug: 'notifications', key: 'notifications', value: true },
  { label: 'Date format', slug: 'date-format', key: 'dateFormat', value: 'yyyy-MM-dd' },
  { label: 'App Width', slug: 'app-width', key: 'appWidth', value: 900 }, // ( Update the app width & height anytime the user changes width & height)
  { label: 'App Height', slug: 'app-height', key: 'appHeight', value: 670 } // ^^^
] as const
