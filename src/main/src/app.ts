import { app, BrowserWindow, screen, shell } from 'electron'
import { differenceInHours } from 'date-fns'

import { mainWindow } from '@main/.'
import { getBaseURL } from '@shared/api'
import { type DotSquadAnims } from '@shared/dot-squad'
import { ResizeApp, WindowControl } from '@shared/types'
import { defaultCoreSettings, defaultUserSettings, settingKeys } from '@shared/default-app-settings'

import { readAppDataJson, saveTimestamps } from './utils'

import { initDatabase, dbExists } from './db'
import { setCoreSetting } from './db/core-settings'
import { setUserSetting } from './db/user-settings'
import { appOriginName, getAppBaseURL } from '@shared/constants'
import { apiGetLoginKey } from './api/auth/api-auth-login-key'

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

    defaultCoreSettings.forEach(async ({ key, value }) => {
      setCoreSetting({ key, value })
      await updateOnLoaderProgress({
        msg: `Adding default core setting:', ${key} - ${value}`,
        enableDelay: false
      })
    })

    defaultUserSettings.forEach(async ({ key, value }) => {
      setUserSetting({ userId: 0, key, value })
      await updateOnLoaderProgress({
        msg: `Adding default user setting:', ${key} - ${value}`,
        enableDelay: false
      })
    })

    await updateOnLoaderProgress({ msg: 'No database .. Created database! 👌', ms: 1000 })
  }

  ms = fastLoad ? 0 : 100

  await updateOnLoaderProgress({ msg: `ENV: ${envMode}`, ms })
  await updateOnLoaderProgress({ msg: `dbExists: ${dbExists}`, ms })
  await updateOnLoaderProgress({ msg: `BaseURL: ${getBaseURL()}`, ms })
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

      setCoreSetting({ key: settingKeys.appWidth, value: w })
      setCoreSetting({ key: settingKeys.appHeight, value: h })

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
  setCoreSetting({ key: settingKeys.appStartTime, value: now })
  saveTimestamps({ appStartTime: now })
}

async function updateAppCloseTime() {
  const now = Date.now()
  setCoreSetting({ key: settingKeys.appEndTime, value: Date.now() })
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
// We can either use a callback from the web client and send the auth codes that we
// could convert into access_tokens

// or

// We could poll to check if the loginKey has been paired if true the api will give this app
// the code to convert into access_tokens

export async function authorizeUserInDefaultBrowser() {
  // Call auth/login-key, to generate a loginKey
  const maybeLoginKey = await apiGetLoginKey()

  if (maybeLoginKey) {
    setCoreSetting({ key: 'loginKey', value: maybeLoginKey })
    const authUrl = `${getAppBaseURL}/auth/auth-app?loginKey=${maybeLoginKey}}&origin=${appOriginName}`
    return await shell.openExternal(authUrl)
  }

  // Handle error
}

export function handleDeepLink(urlStr: string) {
  const urlObj = new URL(urlStr)
  const maybeIntent = urlObj.searchParams.get('intent')

  if (maybeIntent) {
    mainWindow?.webContents.send('auth:code', { code: maybeIntent })
  }
}
