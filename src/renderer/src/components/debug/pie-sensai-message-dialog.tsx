import { useMutation } from '@tanstack/react-query'

import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

export function PieSensaiMessageDialog() {
  const { mutateAsync: sendMessageMutation, isPending } = useMutation({
    mutationKey: ['pie-sensai-message'],
    mutationFn: (data: { message: string; textSize?: number }) => sendMessage(data)
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const message = (formData.get('message') ?? '').toString()
    const textSize = (formData.get('textSize') ?? 1).toString()

    sendMessageMutation({ message, textSize: parseInt(textSize) })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Pie Sensai - Message</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Message</DialogTitle>
            <DialogDescription>Send a message to Pie Sensai.</DialogDescription>
          </DialogHeader>

          <div className="grid py-4 gap-4">
            <Input type="number" name="textSize" defaultValue={2} />
            <Input required name="message" placeholder="Hello!" />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>

            <Button disabled={isPending} type="submit">
              Send
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

async function sendMessage({ message, textSize }: { message: string; textSize?: number }) {
  return await window.api.external.apiPieSensaiMessage({ message, textSize })
}
