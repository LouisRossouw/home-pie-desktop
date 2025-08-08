import { useEffect } from 'react'
import { IpcRendererEvent } from 'electron'
import { useNav } from '~/libs/hooks/use-navigation'

export function RouterListener() {
  const { navigateTo } = useNav()

  useEffect(() => {
    const cleanup = setupRouterListener()
    return cleanup
  }, [])

  function setupRouterListener() {
    const handler = (_event: IpcRendererEvent, { url }: { url: string }) => {
      if (url) {
        navigateTo(url)
      }
    }

    window.api.navigateTo(handler)
    console.log('RouterListener mounted.')

    return () => {
      window.api.removeListener(handler, 'navigate-to')
    }
  }

  return null
}
