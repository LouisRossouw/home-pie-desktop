import { Theme, Themes, themesList } from '~/libs/themes'

export function updateThemeUi(themeName?: string) {
  document.body.classList.remove('default', 'light')

  themesList.forEach((theme: { label: string; slug: string }) => {
    document.body.classList.remove(theme.slug)
  })

  if (themeName) document.body.classList.add(themeName)
}

export function assignClasses({
  theme,
  overrides
}: {
  theme: Theme
  overrides: {
    themeType: 'solid' | 'gradient'
    reverseGradient: boolean
    border: boolean | string
    dontIgnoreText: boolean
    textWindow: string
  }
}) {
  const isSolid = theme.themeType === 'solid'

  // Determine background class
  let bg: string

  if (isSolid) {
    bg = overrides.themeType ?? 'bg-background'
  } else {
    bg =
      overrides.themeType ??
      (overrides?.reverseGradient ? 'bg-theme-gradient-bottom' : 'bg-theme-gradient-top')
  }

  // Apply opacity if solid and has opacity
  const BG = isSolid && theme.opacity ? `${bg}/${theme.opacity}` : bg

  // Determine border class
  const border = theme.border ? (overrides.border ?? theme.border) : ''

  // Determine text color class
  const txt =
    theme.textWindow && overrides?.dontIgnoreText ? (overrides?.textWindow ?? theme.textWindow) : ''

  return [BG, border, txt]
}

export function buildThemeClasses({
  currentTheme,
  overrides
}: {
  currentTheme: Themes
  overrides: any
}) {
  const theme = themesList.find((theme) => theme.slug === currentTheme) as Theme
  return theme?.themeType === undefined ? [] : assignClasses({ theme, overrides })
}
