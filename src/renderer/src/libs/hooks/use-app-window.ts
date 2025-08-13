import { ResizeApp, WindowControl } from '@shared/types'
import { settingKeys } from '@shared/default-app-settings'

import { UseAppSettings } from './use-app-settings'

const windowBaseActions = ['minimize', 'close', 'login']
export const windowModes = ['sidebar-left']

export type UseAppWindow = {
  windowControl: (v: WindowControl) => void
  resizeApp: (v: ResizeApp) => void
  resetWindow: () => void
}

export function useAppWindow(appSettings: UseAppSettings) {
  //
  function resizeApp({ height, width, save }: ResizeApp) {
    window.api.app.resizeApp({ height, width })
    if (save) {
      appSettings.updateAppSettings([
        { setting: settingKeys.appWidth, value: width },
        { setting: settingKeys.appHeight, value: height }
      ])
    }
  }

  function windowControl({ action, width, height }: WindowControl) {
    window.api.app.windowControl({ action, width, height })
    if (!windowBaseActions.includes(action)) {
      appSettings.updateAppSettings([{ setting: settingKeys.appWindowMode, value: action }])

      if (width && height) {
        appSettings.updateAppSettings([
          { setting: settingKeys.appWidth, value: width },
          { setting: settingKeys.appHeight, value: height }
        ])
      }
    }
  }

  function resetWindow() {
    resizeApp({ width: 900, height: 670, save: true })
  }

  return { windowControl, resizeApp, resetWindow }
}
