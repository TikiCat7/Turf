'use client'

import { useOrganization, useUser } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLoadScript } from '@react-google-maps/api'
import format from 'date-fns/format'
import { CalendarIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import usePlacesAutocomplete from 'use-places-autocomplete'
import { z } from 'zod'

import { cn } from '@/lib/utils'

import { TimePickerDemo } from './time-picker-demo'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Card, CardContent } from './ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { ToastAction } from './ui/toast'
import { useToast } from './ui/use-toast'

function Places({ field }: { field: any }) {
  const {
    ready,
    setValue,
    suggestions: { status, data },
  } = usePlacesAutocomplete()

  return (
    <>
      <Input
        placeholder="Search location"
        disabled={!ready}
        {...field}
        onChange={(e) => {
          setValue(e.target.value)
          field.onChange(e)
        }}
      />
      {data.length > 1 && (
        <Card className="p-2 mt-2">
          <CardContent className="space-x-1 p-0 mt-0">
            <p className="text-sm font-bold pl-2 pt-2 pb-2">Suggestions</p>
            {status === 'OK' &&
              data.map((suggestion) => {
                return (
                  <>
                    <p
                      className="text-sm text-muted-foreground hover:bg-primary-foreground rounded-md p-2 cursor-pointer"
                      onClick={() => {
                        setValue(suggestion.description)
                        field.onChange(suggestion.description)
                      }}
                    >
                      {suggestion.description}
                    </p>
                  </>
                )
              })}
          </CardContent>
        </Card>
      )}
    </>
  )
}

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(100).optional(),
  location: z.string().min(2).max(100).optional(),
  session_start_date: z.date({
    required_error: 'Date is required',
  }),
  sessionCategory: z.enum([
    'match',
    'friendly',
    'recreational',
    'training',
    'camp',
    'meeting',
    'other',
  ]),
  teamId: z.string(),
  organiserId: z.string(),
})

const libs = ['places']

export default function SessionCreationForm() {
  const user = useUser()
  const { toast } = useToast()
  const org = useOrganization()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    // @ts-expect-error it's ok
    libraries: libs,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('going to create session')
    try {
      if (!user.user) throw new Error('no user')
      console.log('values: ', JSON.stringify(values))

      const res = await fetch('/api/create-session', {
        body: JSON.stringify(values),
        method: 'POST',
      })

      const data = await res.json()
      console.log(data)

      if (res.status !== 200) {
        throw new Error(data.error.errors[0].message)
      }
      setOpen(false)
      console.log('result: ', data)
      toast({
        title: 'Session Created Successfully',
        description: `${values.name} was created!`,
        action: (
          <ToastAction altText="go_to_gallery">
            <Link href="/team">Go to team page</Link>
          </ToastAction>
        ),
      })
      router.refresh()
    } catch (e: any) {
      console.log(e)
      toast({
        title: 'Session Creation Failed',
        description: e.message,
      })
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      session_start_date: new Date(),
      location: '',
    },
  })

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open)
        form.reset()
      }}
    >
      <DialogTrigger asChild>
        <Button>Create Session</Button>
      </DialogTrigger>
      <DialogContent className={'overflow-y-scroll h-[58%]'}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <DialogHeader>
              <DialogTitle>Create Session</DialogTitle>
              <DialogDescription>
                Create a new upcoming session for your group.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2 pb-4">
              <FormField
                control={form.control}
                name="sessionCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select session type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="match">Match</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="recreational">
                          Recreational
                        </SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="camp">Camp</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
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
                    <FormLabel>Session name</FormLabel>
                    <FormControl>
                      <Input placeholder="Session name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                defaultValue={user.user?.id}
                name="organiserId"
                render={() => <></>}
              />
              <FormField
                control={form.control}
                defaultValue={org.organization?.id}
                name="teamId"
                render={() => <></>}
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
                      {/* <Input placeholder="location" {...field} /> */}
                      {isLoaded && <Places field={field} />}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="session_start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
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
                              format(field.value, 'PPP HH:mm aaaa')
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
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                        <div className="p-3 border-t border-border">
                          <TimePickerDemo
                            setDate={(e) => {
                              field.onChange(e)
                            }}
                            date={field.value}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit">Continue</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
