import { Lightbulb } from 'lucide-react'
import { Outlet, useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'

import tempLogo from '../assets/projects/logo/timeinprogress-logo-play.gif'

// TODO; Fetch projects from the API, either on page load or during app load.
const projects = [
  {
    title: 'TimeInProgress',
    slug: 'time-in-progress',
    img: tempLogo,
    icon: Lightbulb,
    url: '/projects/time-in-progress'
  },
  {
    title: 'InstaInsights',
    slug: 'insta-insights',
    img: undefined,
    icon: Lightbulb,
    url: '/projects/insta-insights'
  }
]

export function Projects() {
  const navigate = useNavigate()

  return (
    <div className="flex h-[calc(100vh-96px)] items-center justify-center">
      <div className="flex h-full border-r items-start">
        <div className="grid justift-center gap-2 p-2">
          {projects.map((project) => {
            return (
              <Button variant={'default'} size={'icon'} onClick={() => navigate(project.url)}>
                {project?.img ? <img src={project.img} width={35} height={35} /> : <project.icon />}
              </Button>
            )
          })}
        </div>
      </div>
      <Outlet />
    </div>
  )
}
