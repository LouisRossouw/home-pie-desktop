import { ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const IPCR = electronAPI.ipcRenderer

export type NavAPI = {
  syncRoute: (v: string) => {}
  navigateTo: (v: any) => {}
}

// prettier-ignore
export const navAPI = {
  syncRoute: (route: string) => IPCR.invoke('sync-route', route),
  navigateTo: (callback: (event: any, data: { url: string }) => void) => ipcRenderer.on('navigate-to', callback)
}
