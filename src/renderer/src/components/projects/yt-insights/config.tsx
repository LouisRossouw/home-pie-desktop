import { useState } from 'react'

import { ApiGetProjectConfig, ApiPutProjectConfig, Schemas } from '@shared/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Braces } from 'lucide-react'

import { LoadingIndicator } from '~/components/loading-indicator'
import { Textarea } from '~/components/ui/textarea'
import { Button } from '~/components/ui/button'

const project = 'yt-insights'

type Config = Schemas['Config']

export function Config() {
  const [newConfig, setNewConfig] = useState<Config | undefined>(undefined)

  const { data, isPending } = useQuery({
    queryKey: ['yt-insights-config'],
    queryFn: async () => await getProjectConfig({ project })
  })

  const { mutate: updateConfigMutation } = useMutation({
    mutationFn: () => updateConfig({ project, config: newConfig! }),
    onSuccess: (success) => {
      if (success) {
        setNewConfig(undefined)
        // TOOD; Add a toast popup
        // TODO; Clear the yt insights cache
      }
    }
  })

  function handleNewConfig(value: string) {
    // TODO; Validate it

    setNewConfig(JSON.parse(value))
  }

  if (isPending) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <LoadingIndicator />
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <div className="flex flex-col gap-4 p-4 w-full h-full">
        <div className="flex w-full justify-end ">
          <Button
            size={'sm'}
            variant={'outline'}
            onClick={() => alert('TODO; Open the config file directly')}
          >
            <Braces />
          </Button>
        </div>
        <Textarea
          className="max-h-100"
          defaultValue={JSON.stringify(data, null, 2)}
          onChange={(e) => handleNewConfig(e.target.value)}
        />
        <div className="flex w-full justify-end ">
          <Button disabled={newConfig ? false : true} onClick={() => updateConfigMutation()}>
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

async function getProjectConfig({ project }: ApiGetProjectConfig) {
  const maybeCondig = await window.api.external.apiGetProjectConfig({ project })
  return maybeCondig ?? []
}

async function updateConfig({ project, config }: ApiPutProjectConfig) {
  if (!config) return false

  return await window.api.external.apiPutProjectConfig({ project, config })
}
