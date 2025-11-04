import { Lightbulb } from 'lucide-react'
import { Project } from '@shared/types'

import { Button } from '~/components/ui/button'

export function ProjectsList({
  isLoading,
  projects,
  isExpanded,
  selectedProject,
  handleSelectedProject
}: {
  isLoading: boolean
  projects: Project[]
  isExpanded: boolean
  selectedProject: string
  handleSelectedProject: (v: string) => void
}) {
  const imgSize = isExpanded ? 35 : 20

  return (
    <>
      {isLoading ? (
        'Loading'
      ) : (
        <div className="grid justift-center gap-4 p-2">
          {projects?.map((project: Project) => {
            const variant =
              selectedProject === project.slug ? 'secondary' : isExpanded ? 'outline' : 'ghost'

            return (
              <Button
                size={'sm'}
                variant={variant}
                key={project.slug}
                className="w-8 h-8 p-0 m-0"
                onClick={() => handleSelectedProject(project.url)}
              >
                {project?.img ? (
                  <img src={project.img} width={imgSize} height={imgSize} />
                ) : (
                  <Lightbulb />
                )}
              </Button>
            )
          })}
        </div>
      )}
    </>
  )
}
