import { CircleCheck } from 'lucide-react'
import { PingSVG } from './svg-icons'

export function OnlineIndicator({ isOnline }: { isOnline: boolean }) {
  const serverIconColor = isOnline ? 'lime' : 'gray'

  return (
    <div>
      <PingSVG
        toPing={false}
        bgColor={serverIconColor === 'lime' ? 'bg-green-400' : 'bg-red-500'}
        children={<CircleCheck size={14} color={serverIconColor} />}
      />
    </div>
  )
}
