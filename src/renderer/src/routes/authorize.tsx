import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { Check } from 'lucide-react'
import invariant from 'tiny-invariant'

import { WindowModes } from '@shared/types'

import { useApp } from '~/libs/context/app'
import { useNav } from '~/libs/hooks/use-navigation'
import { useAccounts } from '~/libs/hooks/use-accounts'
import { windowModes } from '~/libs/hooks/use-app-window'
import { getAllSearchParams } from '~/libs/utils/search-params'

import { LoadingIndicator } from '~/components/loading-indicator'

export default function CompleteAuthorization() {
  const { appSettings, userSettings, windowControl, resizeApp } = useApp()
  const { loginAccount } = useAccounts()
  const { navigateTo } = useNav()

  const [searchParams] = useSearchParams()

  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const sp = getAllSearchParams(searchParams)

  const maybeIntent = sp?.intent

  useEffect(() => {
    windowControl({ action: 'login' }) // Just uses the login sizes.

    if (maybeIntent === 'completed-auth-app') {
      handleCompleteAuthentication()
      return
    }
  }, [maybeIntent])

  async function redirectToStartScreen() {
    const startRoute = userSettings?.startRoute as string | undefined

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

  async function handleCompleteAuthentication() {
    // Call the api with the loginKey to return the access_tokens and user session
    const maybeLoginKey = await window.api.db.getCoreSetting({ key: 'loginKey' })

    if (maybeLoginKey) {
      const res = await window.api.app.apiCompleteAuthentication({ loginKey: maybeLoginKey })

      // Save user session
      const success = await loginAccount(res)

      invariant(success, 'Something went wrong saving user session')

      if (success) {
        setTimeout(() => {
          redirectToStartScreen()
        }, 2000)
        return setSuccess(true)
      }

      // TODO;
      setError(true)
    }
  }

  return (
    <div className="flex w-full h-[calc(100vh-64px)] items-center justify-center p-4 bg-background">
      {success && (
        <div className="grid gap-4 items-center justify-center">
          <div className="flex w-full justify-center">
            <Check size={18} />
          </div>
          <div className="w-full">
            <h1>Done! 😃</h1>
          </div>
        </div>
      )}

      {!success && (
        <div className="grid gap-4 items-center justify-center">
          <div className="flex w-full justify-center">
            <LoadingIndicator />
          </div>
          <div className="w-full">
            <h1>Authorizing App..</h1>
          </div>
        </div>
      )}
    </div>
  )
}
