import { useEffect, useState } from 'react'

import { useApp } from '~/libs/context/app'
import { AppSetting } from '~/libs/hooks/use-app-settings'
import { useNav } from '~/libs/hooks/use-navigation'
import { updateThemeUi } from '~/libs/utils/update-theme-ui'

export function LoaderRoute({
  fastLoad,
  setLoaded
}: {
  fastLoad: boolean
  setLoaded: (v: boolean) => void
}) {
  const { navigateTo } = useNav()
  const { resizeApp, getAllAppSettings: updateContextWithAppSettings } = useApp()

  const [logs, setLogs] = useState<string>('')
  const [appLoaded, setAppLoaded] = useState(false)

  useEffect(() => {
    if (!fastLoad) {
      setupOnLoaderProgress()
    }
    handleLoadAppSettings()
    resizeApp({ width: 400, height: 600 })
  }, [fastLoad])

  useEffect(() => {
    if (appLoaded) {
      setLogs('Done..')
    }
    if (appLoaded) {
      setLoaded(true)
      navigateTo('login')
    }
  }, [appLoaded])

  function setupOnLoaderProgress() {
    const handler = (_event: any, { msg }: { msg: string }) => {
      if (msg) {
        setLogs(msg)
      }
    }
    window.api.onLoaderProgress(handler)
  }

  // Maybe a good place to update any app settings?
  function applyAppSettingsToApp(appSettings: AppSetting) {
    const currentTheme = appSettings?.theme as string | undefined

    updateThemeUi(currentTheme)
  }

  // First initialize if no db, then return core app settings table and push it to app context.
  async function handleLoadAppSettings() {
    const { hasLoaded, isFirstLoad } = await window.api.loadApp({ fastLoad })

    // TODO; If it is the apps first load, redirect to an onboarding or welcome screen?
    if (isFirstLoad) {
      // intentionally left blank until i know what i want to do with this.
    }

    if (hasLoaded) {
      const appSettings = await updateContextWithAppSettings()

      applyAppSettingsToApp(appSettings)

      return setAppLoaded(true)
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
