import { useEffect } from 'react'
import { IpcRendererEvent } from 'electron'
import { useNav } from '~/libs/hooks/use-navigation'
import { appIpcKey } from '@shared/constants'
import { AuthCode } from '@shared/types'

export function AuthListener() {
  const { navigateTo } = useNav()

  useEffect(() => {
    const cleanup = setupAuthListener()
    return cleanup
  }, [])

  function setupAuthListener() {
    const handler = (_event: IpcRendererEvent, { code }: AuthCode) => {
      if (code) {
        console.log('Received auth code:', code)
        // navigateTo(`/auth/callback?code=${code}`)

        if (code === 'completed-auth-app') {
          return navigateTo(`/complete-auth-app?intent=${code}`)
        }
        // navigateTo(`/`)
      }
    }

    window.api.app.onAuthCode(handler)
    console.log('AuthListener mounted.')

    return () => {
      window.api.app.removeListener(handler, appIpcKey.authCode)
    }
  }

  return null
}
