import { DotSquadListener } from './dot-squad-listener'
import { RouterListener } from './router-listener'

export function Middlewear() {
  return (
    <>
      <RouterListener />
      <DotSquadListener />
    </>
  )
}
