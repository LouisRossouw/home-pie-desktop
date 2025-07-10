import { useEffect, useState } from 'react'

import { Middlewear } from './libs/middlewear'
import { AppContextProvider } from './libs/context/app'

import { AppRoutes } from './app-routes'
import { SplashRoute } from './routes/splash'
import { LoaderRoute } from './routes/loader'

import { WindowFrame } from './components/window-frame'
import { WindowFrameDebug } from './components/window-frame-debug'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App(): JSX.Element {
  const [booted, setBooted] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => setBooted(true), 4000)
  }, [])

  if (!booted) {
    return <SplashRoute />
  }

  if (booted && !loaded) {
    return <LoaderRoute loaded={loaded} setLoaded={setLoaded} />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <Middlewear />
        <WindowFrame />

        <AppRoutes />

        <WindowFrameDebug />
      </AppContextProvider>
    </QueryClientProvider>
  )
}
