import { useMemo } from 'react'
import { Outlet, useNavigate } from 'react-router'

import { Lightbulb } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { Button } from '~/components/ui/button'

import tempLogo from '../assets/projects/logo/timeinprogress-logo-play.gif'

// TODO; Fetch projects from the API, either on page load or during app load.
const projectsAppRoutes = [
  {
    slug: 'time-in-progress',
    img: tempLogo,
    url: '/projects/time-in-progress'
  },
  {
    slug: 'insta-insights',
    img: undefined,
    url: '/projects/insta-insights'
  }
]

export default function Projects() {
  const navigate = useNavigate()

  // Fetch additional project data from the server, ie, is the project active etc.
  const { data: projectsRaw, isPending } = useQuery({
    queryKey: ['projects-list'],
    queryFn: getProjects
  })

  const projects = useMemo(() => {
    return projectsAppRoutes?.map((proj) => {
      const foundProject = projectsRaw?.find((p) => p.slug === proj.slug)

      return { ...proj, ...foundProject, img: proj?.img ? proj.img : foundProject?.img }
    })
  }, [projectsRaw])

  return (
    <div className="flex h-[calc(100vh-96px)] items-center justify-center">
      <div className="flex h-full border-r items-start">
        {isPending ? (
          'Loading'
        ) : (
          <div className="grid justift-center gap-2 p-2">
            {projects?.map((project) => {
              return (
                <Button
                  key={project.slug}
                  variant={'default'}
                  size={'icon'}
                  onClick={() => navigate(project.url)}
                >
                  {project?.img ? <img src={project.img} width={35} height={35} /> : <Lightbulb />}
                </Button>
              )
            })}
          </div>
        )}
      </div>
      <Outlet />
    </div>
  )
}

async function getProjects() {
  const { data } = await window.api.apiProjectList()

  return data ?? []
}
