import { useEffect } from 'react'
import { IpcRendererEvent } from 'electron'
import { useNav } from '~/libs/hooks/use-navigation'

export function AuthListener() {
  const { navigateTo } = useNav()

  useEffect(() => {
    const cleanup = setupAuthListener()
    return cleanup
  }, [])

  function setupAuthListener() {
    const handler = (_event: IpcRendererEvent, { code }: { code: string }) => {
      if (code) {
        console.log('Received auth code:', code)
        if (code === 'completed-auth-app') {
          return navigateTo(`/authorize?intent=${code}`)
        }
        // navigateTo(`/`)
      }
    }

    window.api.app.onAuthCode(handler)
    console.log('AuthListener mounted.')

    return () => {
      window.api.app.removeListener(handler, 'auth:code')
    }
  }

  return null
}
