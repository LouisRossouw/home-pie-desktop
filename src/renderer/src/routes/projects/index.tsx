import { useMemo, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

import { type Project } from '@shared/types'
import { useQuery } from '@tanstack/react-query'
import {
  PanelGroup,
  ImperativePanelHandle,
  ImperativePanelGroupHandle
} from 'react-resizable-panels'

import { ResizableHandle } from '~/components/ui/resizable'
import { ProjectsList } from '~/components/projects-list'
import { ProjectsPanel } from './projects-panel'
import { OutletPanel } from './outlet-panel'
import { projectsAppRoutes } from './projects-routes-list'

export default function ProjectsRoute() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null)

  const projectsPanelRef = useRef<ImperativePanelHandle>(null)
  const outletPanelRef = useRef<ImperativePanelHandle>(null)

  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false)

  // Fetch additional project data from the server, ie, is the project active etc.
  const { data: projectsRaw, isPending } = useQuery({
    queryKey: ['projects-list'],
    queryFn: getProjects
  })

  const projects = useMemo(() => {
    return buildProjectsList(projectsRaw)
  }, [projectsRaw]) as Project[]

  const currentSubRoutes = pathname.split('/')
  const selectedProject = currentSubRoutes[currentSubRoutes.length - 1]

  return (
    <div className="flex h-[calc(100vh-96px)] items-center justify-center">
      <PanelGroup direction="horizontal" ref={panelGroupRef}>
        <ProjectsPanel
          ref={projectsPanelRef}
          onChange={(v: boolean) => setIsProjectsExpanded(v)}
          children={
            <ProjectsList
              isLoading={isPending}
              projects={projects}
              isExpanded={isProjectsExpanded}
              selectedProject={selectedProject}
              handleSelectedProject={(v: string) => navigate(v)}
            />
          }
        />
        <ResizableHandle className="w-[1px]" />
        <OutletPanel ref={outletPanelRef} children={<Outlet />} />
      </PanelGroup>
    </div>
  )
}

function buildProjectsList(projectsRaw?: Project[]) {
  if (!projectsRaw) return []

  return projectsAppRoutes?.map((proj) => {
    const foundProject = projectsRaw?.find((p) => p.slug === proj.slug)

    return { ...proj, ...foundProject, img: proj?.img ? proj.img : foundProject?.img }
  })
}

async function getProjects() {
  const { data } = await window.api.apiProjectList()

  return data ?? []
}
