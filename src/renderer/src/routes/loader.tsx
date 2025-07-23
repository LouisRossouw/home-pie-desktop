import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useApp } from '~/libs/context/app'
import { AppSetting } from '~/libs/hooks/use-app-settings'
import { updateThemeUi } from '~/libs/utils/update-theme-ui'

export function LoaderRoute({ setLoaded }: { setLoaded: (v: boolean) => void }) {
  const { getAllAppSettings: updateContextWithAppSettings } = useApp()
  const navigate = useNavigate()

  const [logs, setLogs] = useState<string>('')
  const [appLoaded, setAppLoaded] = useState(false)

  useEffect(() => {
    setupOnLoaderProgress()
    handleLoadAppSettings()
    window.api.resizeApp({ width: 400, height: 600 })
  }, [])

  useEffect(() => {
    if (appLoaded) {
      setLogs('Done..')
    }
    if (appLoaded) {
      setLoaded(true)
      navigate('login')
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
    const success = await window.api.loadApp()

    if (success) {
      const appSettings = await updateContextWithAppSettings()

      applyAppSettingsToApp(appSettings)

      return setAppLoaded(true)
    }

    console.error('App init broke!')
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
