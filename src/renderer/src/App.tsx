import { AppRoutes } from './app-routes'

export default function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div className="flex items-center justify-center bg-slate-500 w-screen h-screen">
      <AppRoutes />
    </div>
  )
}
