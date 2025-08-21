import { appIpcHandlers } from './app-ipc'
import { navIpcHandlers } from './nav-ipc'
import { testIpcHandlers } from './test-ipc'
import { externalIpcHandlers } from './external-ipc'
import { databaseIpcHandlers } from './database-ipc'

export const ipcHandlers = [
  appIpcHandlers,
  navIpcHandlers,
  externalIpcHandlers,
  databaseIpcHandlers,
  testIpcHandlers
]

export function registerIpcHandlers() {
  ipcHandlers.forEach((handler) => handler())
}
