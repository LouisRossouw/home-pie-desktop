import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { format } from 'date-fns'

import { ArrowLeft } from 'lucide-react'

import { useApp } from '~/libs/context/app'
import { usePoll } from '~/libs/hooks/use-poll-counter'

import { Button } from '~/components/ui/button'
import { getAppName } from '@shared/constants'
import { capitalize } from '~/libs/utils/utils'
import { Logo } from '~/components/logo'

export function Login() {
  const { windowControl } = useApp()

  const { startPolling } = usePoll()

  const [searchParams] = useSearchParams()

  const [readyToSignIn, setReadyToSignIn] = useState(false)
  const [waitingAuth, setWaitingAuth] = useState(false)

  const maybeForceLogout = searchParams.get('forceLogout')
  const maybeIntent = searchParams.get('intent')

  async function handleAuthRedirect() {
    if (maybeIntent === 'add-account') {
      window.api.app.apiSignIn({ addAccount: true })
      return setWaitingAuth(true)
    }

    window.api.app.apiSignIn({})
    setWaitingAuth(true)
  }

  useEffect(() => {
    windowControl({ action: 'login' })
    startPolling()

    if (maybeIntent === 'add-account') {
      return setReadyToSignIn(true)
    }

    if (maybeForceLogout) {
      // TODO?
    }
  }, [maybeIntent, maybeForceLogout])

  function reset() {
    setReadyToSignIn(false)
    setWaitingAuth(false)
  }

  const now = new Date()

  return (
    <div className="flex w-full h-[calc(100vh-64px)] items-center justify-center p-4 bg-background ">
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
          <div className="text-center space-y-4">
            <h1 className="font-light text-4xl opacity-70">{format(now, 'HH:mm:ss')}</h1>
            <div className="border-y py-4">
              <Logo className="text-8xl" />
            </div>
            <h2 className="font-light text-3xl opacity-70">{format(now, 'yyyy-MM-dd')}</h2>
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
              <div className="flex items-center justify-center">
                <Button variant={'ghost'} onClick={reset}>
                  <ArrowLeft />
                </Button>
              </div>
              <p className="text-xs">
                By signing up or using {capitalize(getAppName.toLowerCase())}, you agree to the
                terms of service and privacy policy.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
