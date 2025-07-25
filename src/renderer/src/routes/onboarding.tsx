import { useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'

// TODO; Some kind of onboarding screen, mostly to acknowledge
// that this is the first load and perhaps define a few settings

export default function OnBoardingRoute() {
  const navigation = useNavigate()

  return (
    <div className="flex w-full h-[calc(100vh-64px)] items-center justify-center p-4 bg-background">
      <div className="grid h-full w-full items-center justify-center p-4 gap-4">
        <div className="text-center w-full space-y-4">
          <h1 className="font-bold text-6xl">Onboarding *</h1>
          <div className="w-full">
            <Button className="w-full" onClick={() => navigation('/')}>
              Skip
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
