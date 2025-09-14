import { useState } from 'react'
import { UserSetting } from '@shared/types'

import { useApp } from '~/libs/context/app'
import { Button } from './ui/button'

import { ThemeSelector } from './theme-selector'
import { Themes } from '~/libs/themes'

// TODO; Update types and func to handle both CORE and USER settings.
// type Changes = { setting: Setting; value: boolean | number | string }
type Changes = { setting: UserSetting; value: boolean | number | string }

export function Settings() {
  const { userSettings, updateUserSettings } = useApp()

  const [changes, setChanges] = useState<Changes[]>([])
  const [success, setSuccess] = useState<boolean | undefined>(undefined)

  function handleAddNewChanges(change: Changes) {
    setSuccess(undefined)
    setChanges((prev) => {
      const filtered = prev.filter((c) => c.setting !== change.setting)
      return [...filtered, change]
    })
  }

  async function saveChanges() {
    // const result = await updateAppSettings(changes)
    const result = await updateUserSettings(changes)
    setSuccess(result)
  }

  const currentTheme = userSettings?.theme as Themes

  return (
    <div className="flex h-[calc(100vh-96px)] items-center justify-center">
      <div className="w-1/3 p-4 grid gap-4">
        <div className="border-b">
          <h2>Settings Screen</h2>
        </div>

        <div className="">
          <label>Theme</label>
          <ThemeSelector currentTheme={currentTheme} handleAddNewChanges={handleAddNewChanges} />
        </div>

        <div>
          {changes.length > 0 && !success && (
            <Button className="w-full" onClick={saveChanges}>
              Save changes
            </Button>
          )}
        </div>
        {/* TODO; Turn this into a popup toaster. */}
        <div className="text-center">
          {success === true && <p>Saved successfully</p>}
          {success === false && <p>Something went wrong =/</p>}
        </div>
      </div>
    </div>
  )
}
