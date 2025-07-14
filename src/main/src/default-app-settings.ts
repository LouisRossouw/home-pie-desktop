// TODO; Move this file somewhere else ?

export const defaultAppSettings = [
  { label: 'Theme', slug: 'theme', key: 'theme', value: 'dark' },
  { label: 'Decimals', slug: 'decimals', key: 'decimals', value: 3 },
  { label: 'Debug', slug: 'debug', key: 'debug', value: false },
  { label: 'Lock screen', slug: 'lock-screen', key: 'lock-screen', value: true },
  { label: 'Auto start app', slug: 'auto-start', key: 'auto-start', value: true },
  { label: 'Notifications', slug: 'notifications', key: 'notifications', value: true },
  { label: 'Date format', slug: 'date-format', key: 'date-format', value: 'yyyy-MM-dd' },
  { label: 'App Width', slug: 'app-width', key: 'app-width', value: 900 }, // ( Update the app width & height anytime the user changes width & height)
  { label: 'App Height', slug: 'app-height', key: 'app-height', value: 670 } // ^^^
]
