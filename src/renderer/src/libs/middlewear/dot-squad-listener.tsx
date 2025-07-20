import { useEffect } from 'react'
import { IpcRendererEvent } from 'electron'

import { useApp } from '~/libs/context/app'
import { dotSquadAnims } from '@shared/dot-squad'

export function DotSquadListener() {
  const { handleUpdateDotSquad } = useApp()

  useEffect(() => {
    const cleanup = setupOnDotSquadActivity()
    return cleanup
  }, [])

  function setupOnDotSquadActivity() {
    const handler = (_event: IpcRendererEvent, { activity }: { activity: string }) => {
      if (activity) {
        console.log('++ ', dotSquadAnims[activity])
        handleUpdateDotSquad(dotSquadAnims[activity])
      }
    }
    window.api.updateDotSquad(handler)
    console.log('DotSquad mounted.')

    return () => {
      window.api.removeListener(handler, 'dot-squad')
    }
  }

  return null
}
