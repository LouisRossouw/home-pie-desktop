import { CheckCircle, Clipboard, File, Folder, RefreshCcw, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '../ui/label'
import { ProgressBar } from '../progressbar'
import { Copy } from '../copy'
import { LoadingIndicator } from '../loading-indicator'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Separator } from '../ui/separator'

const projectsPath = import.meta.env.VITE_LOCAL_SERVER_PROJECTS_PATH

export function GenGenTimeInProgress() {
  const [copied, setCopied] = useState(false)
  const [checkProgress, setCheckProgress] = useState(false)

  const { data, isPending, isFetching, refetch } = useQuery({
    queryKey: ['check-gengen'],
    queryFn: apiGenGenCheckProgress,
    refetchInterval: 1000,
    enabled: checkProgress
  })

  const progressData = data?.progress
  const isDone = progressData?.done

  useEffect(() => {
    if (data?.ok && isDone) {
      setCheckProgress(false)
      return
    }

    if (!checkProgress) {
      refetch()
    }
  }, [checkProgress, data, isDone])

  async function handleCopyText(text: string) {
    if (text) {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
      } catch (err) {
        setCopied(false)
        console.error('Failed to copy: ', err)
      }
    }
  }

  async function startGenGen() {
    const { ok, hasStarted } = await window.api.external.apiGenGenStart({
      project: 'time.in.progress'
    })

    if (ok && hasStarted) {
      return setCheckProgress(true)
    }
    console.log('Something went wrong')
  }

  async function OpenDirectory(file: string) {
    window.api.app.openDirectory({ path: projectsPath + (file ?? '/') })
  }

  if (isPending) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <LoadingIndicator />
      </div>
    )
  }

  if (!isPending && !data) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p>Something went wrong..</p>
      </div>
    )
  }

  return (
    <div className="flex w-full h-[calc(100vh-200px)] items-center justify-center animate-in fade-in duration-800 ease-in-out">
      <div className="w-full h-full">
        <div className="flex item-center justify-between p-4">
          <Label className="text-lg">Time In Progress</Label>

          <div className="flex items-center justify-center gap-4">
            {checkProgress && (
              <Button variant={'secondary'} onClick={() => setCheckProgress(false)}>
                Stop
              </Button>
            )}
            <Button disabled={checkProgress} onClick={startGenGen}>
              {checkProgress ? <LoadingIndicator /> : 'Generate Video'}
            </Button>
            {!checkProgress && (
              <Button onClick={() => refetch()}>
                {isFetching ? <LoadingIndicator /> : <RefreshCcw />}
              </Button>
            )}
          </div>
        </div>
        <div className="flex w-full h-full items-center justify-center">
          {isDone ? (
            <div className="grid grid-cols-3">
              <div className="flex items-center justify-center">
                <div>
                  <Label>Generated</Label>
                </div>
              </div>
              <div className="grid border rounded-lg p-4 gap-4">
                <div className="flex justify-center border-b pb-4">
                  <Label>{progressData?.manifest?.gengen_title}</Label>
                  <Copy
                    copied={false}
                    handleCopy={() => handleCopyText(progressData?.manifest?.gengen_title)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <Label>Generated Bio</Label>
                    <Copy
                      copied={false}
                      handleCopy={() =>
                        handleCopyText(progressData?.manifest?.gengen_description_str)
                      }
                    />
                  </div>
                  <Textarea defaultValue={progressData?.manifest?.gengen_description_str} />
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <Label>Manifest</Label>
                    <Copy
                      copied={false}
                      handleCopy={() => handleCopyText(progressData?.manifest)}
                    />
                  </div>
                  <Textarea
                    className="max-h-20"
                    defaultValue={JSON.stringify(progressData?.manifest)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="grid p-4 gap-4 border rounded-lg">
                  <div className="grid gap-1">
                    <Label>{progressData?.manifest?.title}</Label>
                    <p className="text-xs font-light">
                      {format(progressData?.manifest?.date, 'yyyy-MM-dd HH:MM')}
                    </p>
                  </div>
                  <Separator />
                  <div className="flex w-full justify-between gap-4">
                    <Label>Open directory</Label>
                    <Button
                      variant={'ghost'}
                      onClick={() => OpenDirectory(progressData?.files?.file_output_dir_short)}
                    >
                      <File />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full h-full items-center justify-center">
              {checkProgress ? (
                <div className="w-1/3">
                  <ProgressBar
                    textLeft="Generating"
                    textRight=""
                    decimal={0}
                    percentage={34}
                    colorStart="rgba(150,105,200, 1)"
                    colorEnd="rgba(0,255,255, 1)"
                  />
                </div>
              ) : (
                <p className="opacity-50">Nothing generated..</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

async function apiGenGenCheckProgress() {
  const response = await window.api.external.apiGenGenCheckProgress({
    project: 'time.in.progress'
  })
  return response ?? {}
}
