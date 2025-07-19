import { anims } from './frames'

export const dotSquadAnims = {
  ...anims
}

export type Frame = {
  a: string
  b: string
  c: string
  delay: number
}
