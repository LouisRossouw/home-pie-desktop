// Experimental notifications that constists of three little dots that light up and do patterns based on activity.
// * Heavy on the state changes but its fun!

import { DotFilledIcon } from '@radix-ui/react-icons'
import { useApp } from '~/libs/context/app'

export function DotSquad() {
  const { dotA, dotB, dotC } = useApp()
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex items-center">
        <DotFilledIcon className="h-8 w-8 p-0 m-0" style={{ color: dotA }} />
        <DotFilledIcon className="h-8 w-8 p-0 m-0" style={{ color: dotB }} />
        <DotFilledIcon className="h-8 w-8 p-0 m-0 " style={{ color: dotC }} />
      </div>
    </div>
  )
}
