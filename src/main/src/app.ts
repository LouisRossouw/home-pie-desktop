import { app, BrowserWindow } from 'electron'

import { mainWindow } from '@main/.'
import { getBaseURl } from '@shared/api'
import { type DotSquadAnims } from '@shared/dot-squad'

import { defaultAppSettings } from './default-app-settings'
import { initDatabase, setSetting, dbExists } from './database'

const envMode = import.meta.env.MODE

export async function loadApp() {
  await updateOnLoaderProgress({ msg: 'Loading app.. 😀', ms: 2000 })

  if (!dbExists) {
    initDatabase()
    defaultAppSettings.forEach(async (setting) => {
      setSetting(setting.key, setting.value)
      await updateOnLoaderProgress({
        msg: `Adding default setting:', ${setting.key} - ${setting.value}`,
        enableDelay: false
      })
    })
    await updateOnLoaderProgress({ msg: 'No database .. Created database! 👌', ms: 1000 })
  }

  await updateOnLoaderProgress({ msg: `ENV: ${envMode}` })
  await updateOnLoaderProgress({ msg: `dbExists: ${dbExists}` })
  await updateOnLoaderProgress({ msg: `BaseURL: ${getBaseURl()}` })
  await updateOnLoaderProgress({ msg: `UserPath: ${app.getPath('userData')}` })

  return true
}

export type WindowControl = { action: 'minimize' | 'maximize' | 'close' }

export function windowControl({ action }: WindowControl) {
  const win = BrowserWindow.getFocusedWindow()
  if (!win) return

  switch (action) {
    case 'minimize':
      win.minimize()
      break
    case 'maximize':
      win.isMaximized() ? win.unmaximize() : win.maximize()
      break
    case 'close':
      win.close()
      break
  }
}

export type ResizeApp = { width: number; height: number }

export function resizeApp({ width, height }: ResizeApp) {
  const win = BrowserWindow.getFocusedWindow()

  if (win) {
    win.center()
    win.setSize(width, height)
  }
}

// Updates the renderer loader screen.
export async function updateOnLoaderProgress({
  msg,
  ms = 100,
  enableDelay = true
}: {
  msg: string
  ms?: number
  enableDelay?: boolean
}) {
  console.log('Loader: ', msg)
  mainWindow?.webContents.send('loader-progress', { msg })
  enableDelay && (await new Promise((resolve) => setTimeout(resolve, ms)))
}

// Updates the dot squad to play an animation pattern as a "notification".
export async function updateDotSquadActivity({ activity }: { activity: DotSquadAnims }) {
  console.log('Sending dot squad notification activity -', activity)
  mainWindow?.webContents.send('dot-squad', { activity })
}
