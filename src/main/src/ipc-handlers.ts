import { ipcMain } from 'electron'
import { loadApp, resizeApp, windowControl } from './app'
import { apiTest } from '@main/src/api/api-test'
import { apiProjectList } from '@main/src/api/projects/api-projects-list'
import { mainWindow } from '@main/.'

function appIpcHandlers() {
  ipcMain.handle('resize-app', (_event, { width, height }) => {
    resizeApp({ width, height })
  })

  ipcMain.handle('load-app', (_event) => {
    return loadApp()
  })

  ipcMain.on('window-control', (_event, { action }) => {
    windowControl({ action })
  })
}

function projectsIpcHandlers() {
  ipcMain.handle('api-projects-list', async (_event) => {
    return await apiProjectList()
  })
}

// function sessionIpcHandlers(){
//     ipcMain.handle('api-todo', async (_event) => {
//     return await apiProjectList()
//   })
// }

function testIpcHandlers() {
  ipcMain.handle('api-test', async (_event) => {
    return await apiTest()
  })

  ipcMain.handle('api-logout-test', async (_event) => {
    return mainWindow?.webContents.send('navigate-to', { url: '/login?forceLogout=true' })
  })
}

export function registerIpcHandlers() {
  appIpcHandlers()
  projectsIpcHandlers()
  testIpcHandlers()
}
