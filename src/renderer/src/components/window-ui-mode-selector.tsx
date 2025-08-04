import { Setting } from '@shared/types'
import {
  Select,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectContent,
  SelectTrigger
} from '~/components/ui/select'
import { WindowUIModes, windowUIModes } from '~/libs/window-ui-modes'

type SettingValue = boolean | number | string

export function WindowUIModeSelector({
  currentUIMode,
  handleUIModeChange
}: {
  currentUIMode?: WindowUIModes
  handleUIModeChange: (v: { setting: Setting; value: SettingValue }) => void
}) {
  function handleWindowUIChange(value: string) {
    handleUIModeChange({ setting: 'theme', value })
  }

  return (
    <Select
      defaultValue={currentUIMode ?? 'TODO'}
      onValueChange={(value) => handleWindowUIChange(value)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a ui" />
      </SelectTrigger>
      <SelectContent className="w-full">
        <SelectGroup>
          {windowUIModes.map((item) => {
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
