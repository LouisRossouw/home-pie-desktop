import { useEffect } from 'react'
import { IpcRendererEvent } from 'electron'

import { useApp } from '~/libs/context/app'
import { type DotSquadAnims } from '@shared/dot-squad'

export function DotSquadListener() {
  const { handleUpdateDotSquad } = useApp()

  useEffect(() => {
    const cleanup = setupOnDotSquadActivity()
    return cleanup
  }, [])

  function setupOnDotSquadActivity() {
    const handler = (_event: IpcRendererEvent, { activity }: { activity: DotSquadAnims }) => {
      if (activity) {
        handleUpdateDotSquad(activity)
      }
    }
    window.api.app.updateDotSquad(handler)
    console.log('DotSquad mounted.')

    return () => {
      window.api.app.removeListener(handler, 'dot-squad')
    }
  }

  return null
}
