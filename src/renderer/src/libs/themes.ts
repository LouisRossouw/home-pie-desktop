export const themesList = [
  {
    active: true,
    label: 'Light',
    slug: 'light'
  },
  {
    active: true,
    label: 'Dark',
    slug: 'dark'
  },
  {
    active: true,
    label: 'Cyberpunk',
    slug: 'cyberpunk'
  },
  {
    active: true,
    label: 'Holographic',
    slug: 'holographic'
  },
  {
    active: true,
    label: 'Retro Neon',
    slug: 'retro-neon'
  },
  {
    active: true,
    label: 'Retrowave Synthwave',
    slug: 'retrowave-synthwave'
  },
  {
    active: true,
    label: 'Modern-Minimalisty Ish',
    slug: 'modern-minimalisty-ish'
  },
  {
    active: true,
    label: 'Mystic Forest',
    slug: 'mystic-forest'
  },
  {
    active: true,
    label: 'Solar Twilight',
    slug: 'solar-twilight'
  },
  {
    active: true,
    label: 'Gradient Test',
    slug: 'gradient-test',
    themeType: 'gradient',
    border: true,
    textWindow: 'text-black',
    opacity: 50
  }
] as const

export type Theme = {
  active: boolean
  label: string
  slug: string
  themeType?: string
  border?: boolean
  textWindow?: string
  opacity?: number
}

export type Themes = (typeof themesList)[number]['slug'] | undefined
