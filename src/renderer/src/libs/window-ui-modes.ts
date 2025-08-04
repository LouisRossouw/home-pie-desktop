export const windowUIModes = [
  {
    active: true,
    label: 'Sidebar Left',
    slug: 'sidebar-left'
  }
] as const

export type WindowUIModes = (typeof windowUIModes)[number]['slug']
