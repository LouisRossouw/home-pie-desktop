import { themesList } from '~/libs/themes'

export function updateThemeUi(themeName?: string) {
  document.body.classList.remove('default', 'light')

  themesList.forEach((theme: { label: string; slug: string }) => {
    document.body.classList.remove(theme.slug)
  })

  if (themeName) document.body.classList.add(themeName)
}
