import { useState } from 'react'
import { themesList } from '~/libs/themes'
import {
  Select,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectContent,
  SelectTrigger
} from '~/components/ui/select'

export function ThemeSelector() {
  const [value, setValue] = useState('')

  function saveTheme() {
    // TODO; Write to database
  }

  function updateThemeUi(themeName?: string) {
    document.body.classList.remove('default', 'light')

    themesList.forEach((theme: { label: string; slug: string }) => {
      document.body.classList.remove(theme.slug)
    })

    if (themeName) document.body.classList.add(themeName)
  }

  function handleThemeChange(value: string) {
    setValue(value)
    updateThemeUi(value)
  }

  const defaultTheme = 'light' // TODO; Needs to come from app settings.

  return (
    <Select defaultValue={defaultTheme} onValueChange={(value) => handleThemeChange(value)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a layout" />
      </SelectTrigger>
      <SelectContent className="w-full">
        <SelectGroup>
          {themesList.map((item) => {
            if (item.active) {
              return (
                <SelectItem key={item.label} value={item.slug}>
                  {item.label}
                </SelectItem>
              )
            }
            return null
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
