import { getBaseURl } from '@shared/api'
import { BrowserWindow } from 'electron'
import { app } from 'electron'
import { db, checkIfDatabase } from './database'
const fs = require('fs')

export type ResizeApp = { width: number; height: number }

export function resizeApp({ width, height }: ResizeApp) {
  const win = BrowserWindow.getFocusedWindow()

  if (win) {
    win.center()
    win.setSize(width, height)
  }
}

export function loadApp() {
  console.log('Loading app..')

  const userPath = app.getPath('userData')
  const maybeDatabase = checkIfDatabase()

  console.log('ENV:', import.meta.env.MODE)
  console.log('BaseURL:', getBaseURl())
  console.log('UserPath:', userPath)

  if (!maybeDatabase) {
    db.initDatabase()
    db.setSetting('theme', 'dark')
    console.log('No Database - created!')
  }

  return true
}

export type WindowControl = { action: 'minimize' | 'maximize' | 'close' }

export function windowControl({ action }: WindowControl) {
  const win = BrowserWindow.getFocusedWindow()
  if (!win) return

  switch (action) {
    case 'minimize':
      win.minimize()
      break
    case 'maximize':
      win.isMaximized() ? win.unmaximize() : win.maximize()
      break
    case 'close':
      win.close()
      break
  }
}
