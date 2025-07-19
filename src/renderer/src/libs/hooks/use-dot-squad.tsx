import { useEffect, useState } from 'react'

import { type Frame } from '~/libs/dot-squad'
import playDotSquad from '~/libs/dot-squad/dot-squad-play'
import { defaultDotSquadColour } from '~/libs/dot-squad/constants'

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

  function handleUpdateDotSquad(frames: Frame[]) {
    setReload(reload >= 100 ? 0 : reload + 1)
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
  dotA: Frame
  dotB: Frame
  dotC: Frame
  handleUpdateDotSquad: (v: Frame[]) => void
}
