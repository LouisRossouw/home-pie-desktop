import { useEffect } from 'react'
import { IpcRendererEvent } from 'electron'
import { useNavigate } from 'react-router'

export function RouterListener() {
  const navigate = useNavigate()

  useEffect(() => {
    const cleanup = setupRouterListener()
    return cleanup
  }, [])

  function setupRouterListener() {
    const handler = (_event: IpcRendererEvent, { url }: { url: string }) => {
      if (url) {
        navigate(url)
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
