import { Setting } from '@shared/types'
import { settingKeys } from '@shared/default-app-settings'

import { Themes, themesList } from '~/libs/themes'
import { updateThemeUi } from '~/libs/utils/update-theme-ui'

import {
  Select,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectContent,
  SelectTrigger
} from '~/components/ui/select'

type SettingValue = boolean | number | string

export function ThemeSelector({
  currentTheme,
  handleAddNewChanges
}: {
  currentTheme?: Themes
  handleAddNewChanges: (v: { setting: Setting; value: SettingValue }) => void
}) {
  function handleThemeChange(value: string) {
    handleAddNewChanges({ setting: settingKeys.theme, value })
    updateThemeUi(value)
  }

  return (
    <Select
      defaultValue={currentTheme ?? 'light'}
      onValueChange={(value) => handleThemeChange(value)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a theme" />
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
