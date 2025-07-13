import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export function LoaderRoute({
  loaded,
  setLoaded
}: {
  loaded: boolean
  setLoaded: (v: boolean) => void
}) {
  const navigation = useNavigate()

  const [loadedSettings, setLoadedSettings] = useState(false) // Temp
  const [timeHasElapsed, setTimeHasElapsed] = useState(false)

  async function handleLoadAppSettings() {
    // TODO; Load app settings

    const success = await window.api.loadApp()
    console.log('Loaded:', success)
    setLoadedSettings(success)
  }

  useEffect(() => {
    if (!loaded) {
      setTimeout(() => setTimeHasElapsed(true), 4000)
      setTimeout(() => handleLoadAppSettings(), 2000) // Temp
      window.api.resizeApp({ width: 400, height: 600 })
    }

    if (loadedSettings && timeHasElapsed) {
      setLoaded(true)
      navigation('login')
    }
  }, [loaded, timeHasElapsed])

  return (
    <div className="flex w-full h-[calc(100vh-32px)] items-center justify-center bg-background rounded-lg">
      <div className="grid gap-4 border rounded-lg p-4 justify-center items-center">
        <h2>Loader screen</h2>
        <h2>{JSON.stringify(loaded)}</h2>
      </div>
    </div>
  )
}
