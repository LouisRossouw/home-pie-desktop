import { Lightbulb } from 'lucide-react'
import { Projects } from '@shared/types'

import { Button } from '~/components/ui/button'

export function ProjectsList({
  loading,
  projects,
  isExpanded,
  selectedProject,
  handleSelectedProject
}: {
  loading: boolean
  projects: Projects[]
  isExpanded: boolean
  selectedProject: string
  handleSelectedProject: (v: string) => void
}) {
  const imgSize = isExpanded ? 35 : 20

  return (
    <>
      {loading ? (
        'Loading'
      ) : (
        <div className="grid justift-center gap-2 p-2">
          {projects?.map((project: any) => {
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
