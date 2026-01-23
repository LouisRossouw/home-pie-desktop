import { useEffect, useState } from 'react'
import { File, RefreshCcw, Film, Play, FileJson, Clock, CheckCircle, List, Info } from 'lucide-react'
import { format } from 'date-fns'

import { useQuery } from '@tanstack/react-query'

import { Copy } from '~/components/copy'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { Separator } from '~/components/ui/separator'
import { ProgressBar } from '~/components/progressbar'
import { LoadingIndicator } from '~/components/loading-indicator'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

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

    if (!checkProgress && data === undefined) {
      refetch()
    }
  }, [checkProgress, data, isDone])

  async function handleCopyText(text: string) {
    if (text) {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
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
      <div className="flex w-full h-[400px] items-center justify-center">
        <LoadingIndicator />
      </div>
    )
  }

  if (!isPending && !data) {
    return (
      <div className="flex w-full h-[400px] items-center justify-center text-muted-foreground flex-col gap-2">
        <Info className="size-8 opacity-20" />
        <p>Something went wrong or no connection to server.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Try Regular Refetch</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full h-full overflow-y-auto scrollbar-hide animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tighter">GenGen</h1>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 uppercase tracking-widest text-[10px] font-bold h-5 px-2">
              Time In Progress
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Automated video generation for daily progress updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {checkProgress && (
            <Button
              variant="outline"
              className="border-red-500/20 text-red-500 hover:bg-red-500/5"
              onClick={() => setCheckProgress(false)}
            >
              Stop Tracking
            </Button>
          )}
          <Button
            size="lg"
            variant="outline"
            className="gap-2 font-bold"
            disabled={checkProgress}
            onClick={startGenGen}
          >
            {checkProgress ? (
              <LoadingIndicator />
            ) : (
              <>

                <Play className="size-4 fill-current" />
                Generate New Video
              </>
            )}
          </Button>
          {!checkProgress && (
            <Button variant="ghost" size="icon" className="size-10 shadow-sm" onClick={() => refetch()}>
              {isFetching ? <LoadingIndicator /> : <RefreshCcw className="size-5" />}
            </Button>
          )}
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* MAIN CONTENT */}
      <div className="flex-1">
        {isDone ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* NARRATIVE COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-transparent border-primary/10 shadow-sm overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-primary/5 py-4">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 opacity-70">
                    <List className="size-4" /> Narrative Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Video Title</Label>
                      <Copy
                        copied={copied}
                        handleCopy={() => handleCopyText(progressData?.manifest?.gengenTitle)}
                      />
                    </div>
                    <p className="text-xl font-bold tracking-tight border-l-2 border-primary/40 pl-4 py-1 italic">
                      &ldquo;{progressData?.manifest?.gengenTitle}&rdquo;
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Generated Bio / Description</Label>
                      <Copy
                        copied={copied}
                        handleCopy={() => handleCopyText(progressData?.manifest?.gengenDescriptionStr)}
                      />
                    </div>
                    <Textarea
                      readOnly
                      className="min-h-[160px] bg-primary/[0.02] border-primary/10 resize-none font-medium text-sm leading-relaxed"
                      value={progressData?.manifest?.gengenDescriptionStr}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-transparent border-primary/10 shadow-sm overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-primary/5 py-3">
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 opacity-50">
                    <FileJson className="size-3" /> Technical Manifest (JSON)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Textarea
                    className="border-none rounded-none bg-black/20 font-mono text-[11px] min-h-[120px] resize-y scrollbar-hide"
                    readOnly
                    value={JSON.stringify(progressData?.manifest, null, 2)}
                  />
                </CardContent>
              </Card>
            </div>

            {/* METADATA COLUMN */}
            <div className="space-y-6">
              <Card className="bg-primary/5 border-primary/20 shadow-md relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Film className="size-24" />
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase opacity-50">Project Build</Label>
                    <h3 className="text-lg font-bold leading-tight">{progressData?.manifest?.title}</h3>
                  </div>

                  <Separator className="bg-primary/10" />

                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                      <Clock className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase opacity-50">Generated At</p>
                      <p className="text-sm font-bold">
                        {progressData?.manifest?.date ? format(new Date(progressData.manifest.date), 'MMM d, yyyy · HH:mm') : 'Unknown Date'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 shrink-0">
                      <CheckCircle className="size-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase opacity-50">Output Status</p>
                      <p className="text-sm font-bold text-green-700">Ready for upload</p>
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    className="w-full mt-4 gap-2 border border-primary/10 font-bold"
                    onClick={() => OpenDirectory(progressData?.files?.fileOutputDirShort)}
                  >
                    <File className="size-4" />
                    Open Directory
                  </Button>
                </CardContent>
              </Card>

              {/* TIPS CARD */}
              <Card className="bg-yellow-500/5 border-yellow-500/20">
                <CardContent className="p-4 flex gap-3">
                  <Info className="size-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-yellow-700">Did you know?</p>
                    <p className="text-[10px] text-yellow-700/70 leading-normal">
                      Generating a new video will overwrite the previous manifest data for this specific project segment.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
            {checkProgress ? (
              <div className="w-full max-w-md space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight">Generation In Progress</h3>
                  <p className="text-sm text-muted-foreground italic">
                    Rendering scenes, synthesizing audio, and assembling technical manifest...
                  </p>
                </div>
                <div className="pt-4">
                  <ProgressBar
                    textLeft="Render Progress"
                    textRight="Processing..."
                    decimal={0}
                    percentage={34}
                    colorStart="rgba(150,105,200, 1)"
                    colorEnd="rgba(0,255,255, 1)"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 opacity-40">
                <div className="size-20 rounded-full bg-muted flex items-center justify-center border-4 border-muted-foreground/10">
                  <Film className="size-10" />
                </div>
                <div>
                  <p className="text-lg font-bold tracking-tight">No Video Generated Today</p>
                  <p className="text-sm font-medium">Click &quot;Generate New Video&quot; to get started.</p>
                </div>
              </div>
            )}
          </div>
        )}
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
