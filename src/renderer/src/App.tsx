import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Middlewear } from './libs/middlewear'
import { AppContextProvider } from './libs/context/app'

import { AppRoutes } from './app-routes'
import { SplashRoute } from './routes/splash'
import { LoaderRoute } from './routes/loader'

import { WindowFrame } from './components/window-frame'
import { WindowFrameDebug } from './components/window-frame-debug'

const queryClient = new QueryClient()

export default function App(): JSX.Element {
  const [booted, setBooted] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [fastLoad, setFastLoad] = useState(false)

  useEffect(() => {
    const init = async () => {
      const maybeSkipBoot = await window.api.maybeFastLoad()

      setTimeout(() => setBooted(true), 4000)

      handleCheckAuth()
      setFastLoad(maybeSkipBoot)
    }
    init()
  }, [])

  function handleCheckAuth() {
    // TODO; Check for active session;
    // * IF access_token has not expired then skip login screen,
    // * IF access_token has expired but refresh_token has not expired then fetch a new access_token, if success skip login screen,
    // * If all fails then show login screen
    // TODO; Also bypass the locked screen / screen saver? somehow if user opted out of that setting
  }

  // TODO; Skip this screen if the app has started within the last ~8-12 hours maybe?
  if (!booted) {
    return <SplashRoute />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        {booted && !loaded ? (
          <LoaderRoute setLoaded={setLoaded} fastLoad={fastLoad} />
        ) : (
          <>
            <Middlewear />
            <WindowFrame />

            <AppRoutes />

            <WindowFrameDebug />
          </>
        )}
      </AppContextProvider>
    </QueryClientProvider>
  )
}
