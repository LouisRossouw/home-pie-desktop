import { app, BrowserWindow, screen, shell } from 'electron'
import { differenceInHours } from 'date-fns'

import { mainWindow } from '@main/.'
import { getBaseURl } from '@shared/api'
import { type DotSquadAnims } from '@shared/dot-squad'
import { ResizeApp, WindowControl } from '@shared/types'
import { defaultAppSettings, settingKeys } from '@shared/default-app-settings'

import { setSetting } from './db/settings'
import { initDatabase, dbExists } from './db'
import { readAppDataJson, saveTimestamps } from './utils'

const envMode = import.meta.env.MODE

export let currentRoute = ''
export let suppressResizeEvent = false

export async function syncRoute(route: string) {
  console.log('Route -', route)
  currentRoute = route
}

// Not sure about this, but maybe we can check if the app can skip the loadApp func.
export async function maybeFastLoad() {
  // TODO; Maybe add more things here, token expiry, etc?

  const now = new Date()

  const appData = readAppDataJson()
  const maybeAppEndTime = appData[settingKeys.appEndTime] as number | undefined

  const lastOpened = maybeAppEndTime ? differenceInHours(now, new Date(maybeAppEndTime)) : undefined
  console.log('lastOpened:', lastOpened ? `${lastOpened} hour(s) ago` : '..First time!')

  const skipSplash = lastOpened ? lastOpened < 8 : lastOpened === 0 // TODO; Make it 12, or based on if it is a new day?

  return { skipSplash, skipLoader: dbExists }
}

export async function loadApp({ fastLoad }: { fastLoad: boolean }) {
  let ms = fastLoad ? 0 : 2000
  await updateOnLoaderProgress({ msg: 'Loading app.. 😀', ms })

  let isFirstLoad = false

  if (!dbExists) {
    isFirstLoad = true

    initDatabase()
    defaultAppSettings.forEach(async (setting) => {
      setSetting({ key: setting.key, value: setting.value })
      await updateOnLoaderProgress({
        msg: `Adding default setting:', ${setting.key} - ${setting.value}`,
        enableDelay: false
      })
    })
    await updateOnLoaderProgress({ msg: 'No database .. Created database! 👌', ms: 1000 })
  }

  ms = fastLoad ? 0 : 100

  await updateOnLoaderProgress({ msg: `ENV: ${envMode}`, ms })
  await updateOnLoaderProgress({ msg: `dbExists: ${dbExists}`, ms })
  await updateOnLoaderProgress({ msg: `BaseURL: ${getBaseURl()}`, ms })
  await updateOnLoaderProgress({ msg: `UserPath: ${app.getPath('userData')}`, ms })

  updateAppStartTime()

  return { hasLoaded: true, isFirstLoad }
}

export function windowControl({ action, width, height }: WindowControl) {
  const win = BrowserWindow.getFocusedWindow()
  if (!win) return

  const primaryDisplay = screen.getPrimaryDisplay()
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize

  suppressResizeEvent = true

  switch (action) {
    case 'minimize':
      win.minimize()
      break
    case 'maximize':
      win.isMaximized() ? win.unmaximize() : win.maximize()
      break
    case 'close':
      updateAppCloseTime()
      win.close()
      break
    case 'sidebar-left':
      const w = width ?? 1000
      const h = height ?? screenHeight

      win.setBounds({ x: 0, y: 0, width: w, height: h })

      setSetting({ key: settingKeys.appWidth, value: w })
      setSetting({ key: settingKeys.appHeight, value: h })

      break
    case 'login':
      resizeApp({ width: 500, height: 800 })
      break
  }

  // SuppressResizeEvent flag is used when the app switches between
  // certain routes, splash, login, etc and suppresses the 'resize' event from firing.
  setTimeout(() => {
    suppressResizeEvent = false
  }, 1000)
}

export function resizeApp({ width, height }: ResizeApp) {
  const win = BrowserWindow.getFocusedWindow()

  if (win) {
    win.setSize(width, height)
    win.center() // Leave this last so that we center on the new values
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

async function updateAppStartTime() {
  const now = Date.now()
  setSetting({ key: settingKeys.appStartTime, value: now })
  saveTimestamps({ appStartTime: now })
}

async function updateAppCloseTime() {
  const now = Date.now()
  setSetting({ key: settingKeys.appEndTime, value: Date.now() })
  saveTimestamps({ appEndTime: now })
}

export async function openDirectory({ path }: { path: string }) {
  try {
    const result = await shell.openPath(path)

    if (result) {
      console.error(`Error opening directory: ${result}`)
    } else {
      console.log(`Directory opened successfully: ${path}`)
    }
  } catch (error) {
    console.error(`Failed to open directory: ${error}`)
  }
}
