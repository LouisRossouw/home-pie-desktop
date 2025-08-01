import { RouterListener } from './router-listener'
import { DotSquadListener } from './dot-squad-listener'
import { WindowResizeListener } from './resize-listener'

export function Middlewear() {
  return (
    <>
      <RouterListener />
      <DotSquadListener />
      <WindowResizeListener />
    </>
  )
}
