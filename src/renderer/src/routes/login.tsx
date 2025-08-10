import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { format } from 'date-fns'

import { WindowModes } from '@shared/types'

import { useApp } from '~/libs/context/app'
import { useNav } from '~/libs/hooks/use-navigation'
import { usePoll } from '~/libs/hooks/use-poll-counter'
import { windowModes } from '~/libs/hooks/use-app-window'

import { Button } from '~/components/ui/button'

export default function Login() {
  const { appSettings, resizeApp, windowControl } = useApp()
  const { navigateTo } = useNav()

  const { startPolling, stopPolling } = usePoll()

  const [searchParams] = useSearchParams()

  const [readyToSignIn, setReadyToSignIn] = useState(false)

  const maybeForceLogout = searchParams.get('forceLogout')

  useEffect(() => {
    windowControl({ action: 'login' })
    startPolling()

    if (maybeForceLogout) {
      // TODO?
    }
  }, [maybeForceLogout])

  function handleManualLogin() {
    const startRoute = appSettings?.startRoute as string | undefined

    stopPolling()
    navigateTo(startRoute ?? '/')

    // TODO; Fetch app width & height from storage or app context, before resizing.
    const width = appSettings?.appWidth as number
    const height = appSettings?.appHeight as number
    const appWindowMode = appSettings?.appWindowMode as WindowModes

    if (appWindowMode && windowModes.includes(appWindowMode)) {
      return windowControl({ action: appWindowMode, width, height })
    }
    if (width && height) {
      return resizeApp({ width, height, save: false })
    }

    resizeApp({ width: 900, height: 670, save: true })
  }

  const now = new Date()

  // TODO; Add some kind of option that shows a locked out version / screen saved? of the app, with a time etc?
  // currently there is a place holder "readyToSignIn" that does something like this, make this optional

  return (
    <div className="flex w-full h-[calc(100vh-64px)] items-center justify-center p-4 bg-background">
      {!readyToSignIn ? (
        <div className="grid h-full w-full items-center justify-center p-4 gap-4">
          <div className="text-center">
            <h1 className="font-bold text-6xl">{format(now, 'HH:mm:ss')}</h1>
            <h2 className="font-medium text-3xl">{format(now, 'yyyy-MM-dd')}</h2>
          </div>
          <div className="text-center w-full space-y-4">
            <div className="w-full">
              <Button className="w-full" onClick={() => setReadyToSignIn(true)}>
                Sign in
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="w-full">
            <p>* Enter account details / passwords etc screen here *</p>
            <Button className="w-full" onClick={handleManualLogin}>
              Sign in
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
