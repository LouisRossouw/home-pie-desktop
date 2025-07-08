import { BrowserWindow } from 'electron'

export type ResizeApp = { width: number; height: number }

export function resizeApp({ width, height }: ResizeApp) {
  const win = BrowserWindow.getFocusedWindow()

  if (win) {
    win.center()
    win.setSize(width, height)
  }
}
