import { electronAPI } from '@electron-toolkit/preload'
import { type ResizeApp } from '@main/app'

export type Api = { resizeApp: (v: ResizeApp) => void }

export const api = {
  resizeApp: (data: ResizeApp) => electronAPI.ipcRenderer.invoke('resize-app', data)
}
