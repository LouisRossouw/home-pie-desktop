import { useOutletContext } from 'react-router'
import { Button } from '../ui/button'

// TODO; Show an overview of all on mr ping pings status, and the status of the projects it monitors.

export function SmartHomeOverview() {
  const { data, refetch } = useOutletContext<any>()

  return (
    <div className="flex h-[calc(100vh-96px)] items-center justify-center">
      <div className="grid text-center gap-4">
        <Button className="w-20" onClick={refetch}>
          Reload
        </Button>
        <h2>Smart Home overview route</h2>
        {JSON.stringify(data, null, 2)}
      </div>
    </div>
  )
}
