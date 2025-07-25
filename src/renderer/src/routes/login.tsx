import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { format } from 'date-fns'

import { Button } from '~/components/ui/button'
import { buildThemeClasses } from '~/libs/utils/update-theme-ui'
import { cn } from '~/libs/utils/cn'
import { useApp } from '~/libs/context/app'
import { Themes } from '~/libs/themes'

export default function Login() {
  const { appSettings } = useApp()
  const navigation = useNavigate()

  const [searchParams] = useSearchParams()

  const [readyToSignIn, setReadyToSignIn] = useState(false)

  const maybeForceLogout = searchParams.get('forceLogout')

  useEffect(() => {
    window.api.resizeApp({ width: 500, height: 800 })

    if (maybeForceLogout) {
      // TODO?
    }
  }, [maybeForceLogout])

  function handleManualLogin() {
    navigation('/')

    // TODO; Fetch app width & height from storage or app context, before resizing.
    window.api.resizeApp({ width: 900, height: 670 })
  }

  const classes = useMemo(() => {
    const currentTheme = appSettings?.theme as Themes
    return buildThemeClasses({
      currentTheme,
      overrides: {}
    })
  }, [appSettings])

  const now = new Date()

  // TODO; Add some kind of option that shows a locked out version / screen saved? of the app, with a time etc?
  // currently there is a place holder "readyToSignIn" that does something like this, make this optional

  return (
    <div
      className={cn(
        'flex w-full h-[calc(100vh-64px)] items-center justify-center p-4 bg-background',
        ...classes
      )}
    >
      {!readyToSignIn ? (
        <div className="grid h-full w-full items-center justify-center p-4 gap-4">
          <div className="text-center">
            <h1 className="font-bold text-6xl">{format(now, 'HH:mm')}</h1>
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
