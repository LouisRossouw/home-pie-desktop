import { WindowModes } from '@shared/types'
import { useState } from 'react'
import {
  Select,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectContent,
  SelectTrigger
} from '~/components/ui/select'
import { windowUIModes } from '~/libs/window-ui-modes'

export type SettingValue = boolean | number | string

export function WindowUIModeSelector({
  currentUIMode,
  handleUIModeChange
}: {
  currentUIMode?: WindowModes
  handleUIModeChange: (v: { action: WindowModes }) => void
}) {
  const [open, setOpen] = useState(false)

  function handleWindowUIChange(value: string) {
    const action = value as WindowModes
    handleUIModeChange({ action })
  }

  const defaultValue = currentUIMode ? currentUIMode : 'default'

  return (
    <Select
      key={defaultValue}
      defaultValue={defaultValue}
      onOpenChange={() => setOpen(!open)}
      onValueChange={(value) => handleWindowUIChange(value)}
    >
      <SelectTrigger className="w-full border-none shadow-none">
        <SelectValue placeholder="Select a ui" />
      </SelectTrigger>
      <SelectContent className="w-full">
        <SelectGroup>
          {windowUIModes.map((item) => {
            if (item.active) {
              return (
                <SelectItem key={item.label} value={item.slug}>
                  <item.icon />
                  {open && item.label}
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
