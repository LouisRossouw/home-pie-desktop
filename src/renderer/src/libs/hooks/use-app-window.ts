import { ResizeApp, WindowControl } from '@shared/types'
import { UseAppSettings } from './use-app-settings'

const windowBaseActions = ['minimize', 'maximize', 'close']
export const windowModes = ['sidebar-left', 'bottom-left']

export type UseAppWindow = {
  windowControl: (v: WindowControl) => void
  resizeApp: (v: ResizeApp) => void
}

export function useAppWindow(appSettings: UseAppSettings) {
  function resizeApp(newSize: ResizeApp) {
    window.api.resizeApp(newSize)
    appSettings.updateAppSettings([
      { setting: 'appWidth', value: newSize.width },
      { setting: 'appHeight', value: newSize.height }
    ])
  }

  function windowControl({ action }: WindowControl) {
    window.api.windowControl({ action })
    if (!windowBaseActions.includes(action)) {
      appSettings.updateAppSettings([{ setting: 'appWindowMode', value: action }])
    }
  }

  return { windowControl, resizeApp }
}
