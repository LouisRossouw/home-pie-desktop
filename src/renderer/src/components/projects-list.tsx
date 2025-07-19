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
        <div className="grid justift-center gap-2 p-2">
          {projects?.map((project: Project) => {
            const variant =
              selectedProject === project.slug ? 'default' : isExpanded ? 'outline' : 'ghost'

            return (
              <Button
                size={'icon'}
                variant={variant}
                key={project.slug}
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
