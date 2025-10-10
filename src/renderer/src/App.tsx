import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Middlewear } from './libs/middlewear'
import { AppContextProvider } from './libs/context/app'
// import { useRenderTimer } from './libs/hooks/use-render-timer'

import { AppRoutes } from './app-routes'
import { SplashRoute } from './routes/splash'
import { LoaderRoute } from './routes/loader'

import { MrPingPingContextProvider } from './libs/context/mr-ping-ping'
import { DotSquadContextProvider } from './libs/context/dot-squad'
import { DotSquadListener } from './libs/middlewear/dot-squad-listener'
import { useAppOverlay } from './libs/context/overlay'

import { WindowFrame } from './components/window-frame'
import { WindowFrameDebug } from './components/window-frame-debug'
import { LoadingIndicator } from './components/loading-indicator'

const queryClient = new QueryClient()

type FastLoad = { skipSplash: boolean; skipLoader: boolean } | undefined

export default function App(): JSX.Element {
  const { showOverlay } = useAppOverlay()

  const [booted, setBooted] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const [fastLoad, setFastLoad] = useState<FastLoad>(undefined)

  useEffect(() => {
    const init = async () => {
      const fastLoad = await window.api.app.maybeFastLoad()

      if (fastLoad.skipSplash) {
        showOverlay({
          animationType: 'fade',
          mode: 'CHILDREN',
          autoClose: 2000,
          children: (
            <div className="flex w-full items-center justify-center">
              <LoadingIndicator />
            </div>
          )
        })
        setBooted(true)
      } else {
        setTimeout(() => setBooted(true), 4000)
      }
      setFastLoad(fastLoad)
    }
    init()
  }, [])

  // Skip this screen if the app has started within the last ~8-12 hours
  if (!booted && fastLoad !== undefined) {
    return <SplashRoute />
  }

  return (
    <div className="border rounded-lg">
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          {booted && !loaded ? (
            <LoaderRoute setLoaded={setLoaded} fastLoad={fastLoad?.skipLoader ?? false} />
          ) : (
            <>
              <DotSquadContextProvider>
                <WindowFrame />
                {booted && loaded && <DotSquadListener />}
              </DotSquadContextProvider>
              <AppRoutes />
              <MrPingPingContextProvider>
                <WindowFrameDebug />
                {booted && loaded && <Middlewear />}
              </MrPingPingContextProvider>
            </>
          )}
        </AppContextProvider>
      </QueryClientProvider>
    </div>
  )
}
