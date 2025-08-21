import { electronAPI } from '@electron-toolkit/preload'

import type { ApiTest } from '@shared/types'

const IPCR = electronAPI.ipcRenderer

export type TestAPI = {
  apiTest: () => Promise<ApiTest>
  apiLogoutTest: () => {}
}

export const testAPI = {
  apiTest: async () => IPCR.invoke('api-test'),
  apiLogoutTest: () => IPCR.invoke('api-logout-test')
}
