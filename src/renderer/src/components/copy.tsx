import { CheckCircle, Clipboard } from 'lucide-react'
import { Button } from './ui/button'

export function Copy({ copied, handleCopy }: { copied: boolean; handleCopy: () => void }) {
  return (
    <Button className="flex" variant={'ghost'} size={'icon'} onClick={handleCopy}>
      {copied ? <CheckCircle color="lime" size={18} /> : <Clipboard size={16} color={'gray'} />}
    </Button>
  )
}
