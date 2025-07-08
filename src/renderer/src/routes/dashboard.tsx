import { Button } from '~/components/ui/button'

export function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>

      <Button onClick={() => console.log('i work')}>Test button</Button>
    </div>
  )
}
