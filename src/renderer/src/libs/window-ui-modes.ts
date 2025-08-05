import { Airplay, PanelLeftOpen } from 'lucide-react'

export const windowUIModes = [
  {
    active: true,
    label: 'Default',
    slug: 'default',
    icon: Airplay
  },
  {
    active: true,
    label: 'Sidebar Left',
    slug: 'sidebar-left',
    icon: PanelLeftOpen
  }
] as const

export type WindowUIModes = (typeof windowUIModes)[number]['slug']
