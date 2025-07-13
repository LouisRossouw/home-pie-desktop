import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { format } from 'date-fns'

import { Button } from '~/components/ui/button'

export default function Login() {
  const navigation = useNavigate()

  const [searchParams] = useSearchParams()

  const maybeForceLogout = searchParams.get('forceLogout')

  useEffect(() => {
    window.api.resizeApp({ width: 500, height: 800 })

    if (maybeForceLogout) {
      // TODO?
    }
  }, [maybeForceLogout])

  function handleManualLogin() {
    navigation('/')
    window.api.resizeApp({ width: 900, height: 670 })
  }

  const now = new Date()

  return (
    <div className="flex w-full h-[calc(100vh-64px)] items-center justify-center p-4 bg-background">
      <div className="grid h-full w-full items-center justify-center p-4 gap-4">
        <div className="text-center">
          <h1 className="font-bold text-6xl">{format(now, 'HH:MM')}</h1>
          <h2 className="font-medium text-3xl">{format(now, 'yyyy-MM-dd')}</h2>
        </div>
        <div className="text-center w-full space-y-4">
          <div className="w-full">
            <Button className="w-full" onClick={handleManualLogin}>
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
