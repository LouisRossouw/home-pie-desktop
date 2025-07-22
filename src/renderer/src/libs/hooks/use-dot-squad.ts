import { useEffect, useState } from 'react'

import playDotSquad from '@shared/dot-squad/dot-squad-play'
import { defaultDotSquadColour } from '@shared/dot-squad/constants'
import { dotSquadAnims, type DotSquadAnims, type Frame } from '@shared/dot-squad'

// SideNote: saving this file would cause hot reload to add more listeners ..

export function useDotSquad() {
  const [reload, setReload] = useState(0)
  const [frames, setFrames] = useState<Frame[] | undefined>(undefined)

  const [dotA, setDotA] = useState(defaultDotSquadColour)
  const [dotB, setDotB] = useState(defaultDotSquadColour)
  const [dotC, setDotC] = useState(defaultDotSquadColour)

  useEffect(() => {
    if (frames) {
      playDotSquad(frames, setDotA, setDotB, setDotC)
    }
  }, [frames, reload])

  function handleUpdateDotSquad(activity: DotSquadAnims) {
    const frames = dotSquadAnims[activity]

    setReload(reload > 99 ? 0 : reload + 1)
    setFrames(frames)
  }

  return {
    dotA,
    dotB,
    dotC,
    handleUpdateDotSquad
  }
}

export type UseDotSquadType = {
  dotA: string
  dotB: string
  dotC: string
  handleUpdateDotSquad: (v: DotSquadAnims) => void
}
