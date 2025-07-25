import { app } from 'electron'

const fs = require('fs')
import path from 'path'

const appData = path.join(app.getPath('userData'), 'app-data.json')

export function saveTimestamps({
  appStartTime,
  appEndTime
}: {
  appStartTime?: number
  appEndTime?: number
}) {
  let currentData = {}
  if (fs.existsSync(appData)) {
    currentData = readAppDataJson()
  }

  const newData = {
    ...currentData,
    ...(appStartTime && { appStartTime }),
    ...(appEndTime && { appEndTime })
  }

  writeAppDataJson(newData)
}

export function readAppDataJson(): Record<string, unknown> {
  if (fs.existsSync(appData)) {
    const data = fs.readFileSync(appData, 'utf-8')
    try {
      return JSON.parse(data)
    } catch (err) {
      console.error('Failed to parse app-data.json:', err)
    }
  }
  return {}
}

export function writeAppDataJson(data: Record<string, unknown>) {
  fs.writeFileSync(appData, JSON.stringify(data, null, 2))
}
