import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { format } from 'date-fns'

import { WindowModes } from '@shared/types'
import { ArrowLeft } from 'lucide-react'

import { useApp } from '~/libs/context/app'
import { useNav } from '~/libs/hooks/use-navigation'
import { usePoll } from '~/libs/hooks/use-poll-counter'
import { windowModes } from '~/libs/hooks/use-app-window'

import { Button } from '~/components/ui/button'

export default function Login() {
  const { appSettings, userSettings, resizeApp, windowControl } = useApp()
  const { navigateTo } = useNav()

  const { startPolling, stopPolling } = usePoll()

  const [searchParams] = useSearchParams()

  const [readyToSignIn, setReadyToSignIn] = useState(false)
  const [waitingAuth, setWaitingAuth] = useState(false)

  const maybeForceLogout = searchParams.get('forceLogout')

  async function handleAuthRedirect() {
    window.api.app.signIn()
    setWaitingAuth(true)
  }

  useEffect(() => {
    windowControl({ action: 'login' })
    startPolling()

    if (maybeForceLogout) {
      // TODO?
    }
  }, [maybeForceLogout])

  async function tempSkipLogin() {
    const startRoute = userSettings?.startRoute as string | undefined

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

  function reset() {
    setReadyToSignIn(false)
    setWaitingAuth(false)
  }

  const now = new Date()

  return (
    <div className="flex w-full h-[calc(100vh-64px)] items-center justify-center p-4 bg-background">
      {waitingAuth && (
        <div>
          <div className="w-full text-center space-y-4">
            <p>Your default browser should open, you can sign in there.</p>
            <div className="flex items-center justify-center">
              <Button variant={'ghost'} onClick={reset}>
                <ArrowLeft />
              </Button>
            </div>
          </div>
        </div>
      )}

      {!readyToSignIn ? (
        <div
          className="grid h-full w-full items-center justify-center p-4 gap-4"
          onClick={() => setReadyToSignIn(true)}
        >
          <div className="text-center">
            <h1 className="font-bold text-6xl">{format(now, 'HH:mm:ss')}</h1>
            <h2 className="font-medium text-3xl">{format(now, 'yyyy-MM-dd')}</h2>
          </div>
        </div>
      ) : (
        <div>
          {!waitingAuth && (
            <div className="w-full text-center space-y-4">
              <p>Get started for free</p>
              <Button className="w-full" variant={'outline'} onClick={handleAuthRedirect}>
                Sign in
              </Button>
              <Button className="w-full" variant={'outline'} onClick={tempSkipLogin}>
                Skip
              </Button>
              <div className="flex items-center justify-center">
                <Button variant={'ghost'} onClick={reset}>
                  <ArrowLeft />
                </Button>
              </div>
              <p className="text-xs">
                By signing up or using HomePie, you agree to the terms of service and privacy
                policy.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
