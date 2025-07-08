import { Maximize, Minimize2, X } from 'lucide-react'
import { Button } from './ui/button'

// Custom window frame

export function WindowFrame() {
  return (
    <div
      className="h-8 rounded-t-lg w-full flex items-center justify-between px-2 bg-background border-b"
      style={{ WebkitAppRegion: 'drag' }}
    >
      <div>HomePie</div>
      <div>* Notifications here *</div>
      <div className="flex" style={{ WebkitAppRegion: 'no-drag' }}>
        <Button
          size={'sm'}
          variant={'ghost'}
          className="h-8 w-8"
          onClick={() => window.api.windowControl({ action: 'minimize' })}
        >
          <Minimize2 size={18} />
        </Button>
        <Button
          size={'sm'}
          variant={'ghost'}
          className="h-8 w-8"
          onClick={() => window.api.windowControl({ action: 'maximize' })}
        >
          <Maximize size={18} />
        </Button>
        <Button
          size={'sm'}
          variant={'ghost'}
          className="h-8 w-8"
          onClick={() => window.api.windowControl({ action: 'close' })}
        >
          <X size={18} />
        </Button>
      </div>
    </div>
  )
}
