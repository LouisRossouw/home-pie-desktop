import { useEffect, useState } from 'react'

import { useApp } from '~/libs/context/app'
import { AppSettings } from '~/libs/hooks/use-app-settings'
import { useNav } from '~/libs/hooks/use-navigation'
import { updateThemeUi } from '~/libs/utils/update-theme-ui'
import { UserSettings } from '~/libs/hooks/use-user-settings'
import { SessionKey } from '@shared/constants'
import { windowModes } from '~/libs/hooks/use-app-window'
import { WindowModes } from '@shared/types'

type Settings = AppSettings & UserSettings

export function LoaderRoute({
  fastLoad,
  setLoaded
}: {
  fastLoad: boolean
  setLoaded: (v: boolean) => void
}) {
  const { navigateTo } = useNav()
  const {
    resizeApp,
    appSettings,
    userSettings,
    windowControl,
    getAllAppSettings: updateContextWithAppSettings,
    getAllUserSettings: updateContextWithUserSettings
  } = useApp()

  const [logs, setLogs] = useState<string>('')
  const [appLoaded, setAppLoaded] = useState({ loaded: false, isAuth: false })

  useEffect(() => {
    if (!fastLoad) {
      setupOnLoaderProgress()
    }
    handleLoadAppSettings()
    resizeApp({ width: 400, height: 600 })
  }, [fastLoad])

  useEffect(() => {
    if (appLoaded.loaded) {
      setLogs('Done..')
    }
    if (appLoaded.loaded && appLoaded.isAuth) {
      return handleLoadedAsAuthenticated()
    }
    if (appLoaded.loaded && !appLoaded.isAuth) {
      return handleLoadedToLogin()
    }
  }, [appLoaded])

  function handleLoadedToLogin() {
    navigateTo('login')
    setLoaded(true)
  }

  function handleLoadedAsAuthenticated() {
    const startRoute = userSettings?.startRoute as string | undefined

    setLoaded(true)
    navigateTo(startRoute ?? '/')

    // TODO; Fetch app width & height from storage or app context, before resizing.
    const appWindowMode = appSettings?.appWindowMode as WindowModes
    const height = appSettings?.appHeight as number
    const width = appSettings?.appWidth as number

    if (appWindowMode && windowModes.includes(appWindowMode)) {
      return windowControl({ action: appWindowMode, width, height })
    }
    if (width && height) {
      return resizeApp({ width, height, save: false })
    }

    resizeApp({ width: 900, height: 670, save: true })
  }

  function setupOnLoaderProgress() {
    const handler = (_event: any, { msg }: { msg: string }) => {
      if (msg) {
        setLogs(msg)
      }
    }
    window.api.app.onLoaderProgress(handler)
  }

  // Maybe a good place to update any app settings?
  function applyAppSettingsToApp(settings: Settings) {
    const currentTheme = settings?.theme as string | undefined

    updateThemeUi(currentTheme)
  }

  // First initialize if no db, then return core app settings table and push it to app context.
  async function handleLoadAppSettings() {
    const { hasLoaded, isFirstLoad } = await window.api.app.loadApp({ fastLoad })

    // TODO; If it is the apps first load, redirect to an onboarding or welcome screen?
    if (isFirstLoad) {
      // intentionally left blank until i know what i want to do with this.
    }

    if (hasLoaded) {
      const coreSettings = await updateContextWithAppSettings()
      const userSettings = await updateContextWithUserSettings()

      const settings = { ...coreSettings, ...userSettings } as Settings

      applyAppSettingsToApp(settings)

      const userId = (coreSettings?.activeAccountId as number | undefined) ?? 0

      const maybeAccessToken = await window.api.db.getSession({
        key: SessionKey.accessToken,
        userId
      })

      if (maybeAccessToken) {
        const validToken = await window.api.db.checkAccessToken({
          accessToken: maybeAccessToken,
          userId
        })

        return setAppLoaded({ loaded: true, isAuth: validToken ? true : false })
      }

      return setAppLoaded({ loaded: true, isAuth: false })
    }

    console.error('App init broke!')
  }

  // FastLoad hides the loading screen.
  if (fastLoad) {
    return null
  }

  return (
    <div className="flex w-full h-[calc(100vh-32px)] items-center justify-center bg-background rounded-lg">
      <div className="grid w-full gap-4 p-4 justify-center items-center">
        <div className="flex w-full items-center justify-center">
          <h2 className="font-bold">Hello...</h2>
        </div>
        <div className="flex w-full p-4 overflow-hidden">
          <p className="text-muted-foreground text-sm overflow-hidden">{logs}</p>
        </div>
      </div>
    </div>
  )
}
