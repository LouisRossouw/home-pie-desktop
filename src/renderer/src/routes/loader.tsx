import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export function LoaderRoute({ setLoaded }: { setLoaded: (v: boolean) => void }) {
  const navigate = useNavigate()

  const [logs, setLogs] = useState<string>('')
  const [appLoaded, setAppLoaded] = useState(false)

  useEffect(() => {
    window.api.resizeApp({ width: 400, height: 600 })

    handleLoadAppSettings()
    setupOnLoaderProgress()
  }, [])

  function setupOnLoaderProgress() {
    const handler = (_event: any, { msg }: { msg: string }) => {
      if (msg) {
        setLogs(msg)
      }
    }
    window.api.onLoaderProgress(handler)
  }

  async function handleLoadAppSettings() {
    await window.api.loadApp()
    setAppLoaded(true)
  }

  useEffect(() => {
    if (appLoaded) {
      setLogs('Done..')
    }
    if (appLoaded) {
      setLoaded(true)
      navigate('login')
    }
  }, [appLoaded])

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
