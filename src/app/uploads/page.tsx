'use client'

import { useOrganization, useUser } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpChunk } from '@mux/upchunk'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { redirect } from 'next/dist/client/components/redirect'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'
import { cn, formatBytes } from '@/lib/utils'

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(50),
  location: z.string().min(2).max(50),
  date: z.date({
    required_error: 'Date is required',
  }),
  type: z.enum(['Match', 'Friendly', 'Training', 'Misc']),
})

const Uploads = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      date: new Date(),
      type: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startUpload(values)
  }

  const user = useUser()
  if (!user) {
    redirect('/sign-in')
  }

  const org = useOrganization()
  const [file, setFile] = useState<File>()

  const createUpload = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('inside create upload')
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        console.log(await res.json())
        throw new Error('Error creating upload')
      }
      const { url, name } = await res.json()
      console.log('url: ', url)
      console.log('name: ', name)
      return url
    } catch (e) {
      console.error('Error in createUpload')
      setErrorMessage('Error creating upload')
    }
  }

  const prepareUpload = () => {
    const files = inputRef.current?.files
    if (!files) {
      setErrorMessage('No file selected.')
      return
    }
    setFile(files[0])
    setIsUploadModalOpen(true)
  }

  const startUpload = async (values: z.infer<typeof formSchema>) => {
    setIsUploadModalOpen(false)
    setIsUploading(true)
    console.log('starting upload')
    if (!file) {
      setErrorMessage('No file selected.')
      return
    }

    const upload = UpChunk.createUpload({
      endpoint: () => createUpload(values),
      file: file,
    })

    upload.on('error', (err: any) => {
      setIsUploading(false)
      setErrorMessage(err.detail.message)
      // TODO: delete upload record?
    })

    upload.on('progress', (progress: any) => {
      setProgress(Math.floor(progress.detail))
    })

    upload.on('success', async () => {
      setIsUploading(false)
      toast({
        title: 'Video Uploaded Successfully',
        description: `${values.name} is being processed.`,
        action: (
          <ToastAction altText="go_to_gallery">
            <Link href="/assets">Go to gallery</Link>
          </ToastAction>
        ),
      })
      console.log('success uploading, updating upload status')
    })
  }
  return (
    <div className="flex-col py-16 w-4/5 space-y-4">
      <p className="text-4xl font-bold text-primary">Upload Video</p>
      <p className="text-muted-foreground py-4">
        Uploading video to {org.organization?.name}. While uploading, please
        keep the page open!
      </p>

      {errorMessage && <p className="text-primary">{errorMessage}</p>}
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Input
          key={file?.name}
          ref={inputRef}
          id="video"
          type="file"
          onChange={prepareUpload}
          disabled={isUploading}
          accept=".mp4, .mov, .avi, .mkv, .wmv"
        />
        <Dialog
          open={isUploadModalOpen}
          onOpenChange={(open) => {
            setIsUploadModalOpen(open)
            form.reset()
            inputRef.current?.value === null
            setFile(undefined)
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Video Details</DialogTitle>
              <DialogDescription>
                Add details for your video file.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="text-muted-foreground text-xs">
                  <p>File: {file?.name}</p>
                  <p>Size: {formatBytes(Number(file?.size))} bytes</p>
                  <p>Type: {file?.type}</p>
                </div>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select video type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Match">Match</SelectItem>
                          <SelectItem value="Friendly">Friendly</SelectItem>
                          <SelectItem value="Training">Training</SelectItem>
                          <SelectItem value="Misc">Misc</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Name</FormLabel>
                      <FormControl>
                        <Input placeholder="video name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover
                        open={isCalendarOpen}
                        onOpenChange={setIsCalendarOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-[240px] pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(e) => {
                              field.onChange(e)
                              setTimeout(() => setIsCalendarOpen(false), 130)
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Upload Video</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        {isUploading && <Progress className="my-2" value={progress} />}
      </div>
    </div>
  )
}

export default Uploads
