function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <div className="flex w-full h-full">
      <p>Test</p>
    </div>
  )
}

export default App
