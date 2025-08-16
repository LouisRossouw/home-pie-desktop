import { useEffect } from 'react'
import { IpcRendererEvent } from 'electron'
import { useMrPingPing } from '~/libs/context/mr-ping-ping'

export function ProcessListener() {
  const mrPingPing = useMrPingPing()

  useEffect(() => {
    const cleanup = setupProcessListener()
    return cleanup
  }, [])

  async function handleActivityTest(activity: string) {
    if (activity === 'is-check-mr-ping-ping-status') {
      mrPingPing.handleGetStatus()
    }
  }

  function setupProcessListener() {
    const handler = (_event: IpcRendererEvent, { activity }: { activity: string }) => {
      if (activity) {
        handleActivityTest(activity)
      }
    }

    window.api.app.emitProcessActivity(handler)
    console.log('EmitProcessListener mounted.')

    return () => {
      window.api.app.removeListener(handler, 'emit-process-activity')
    }
  }

  return null
}
