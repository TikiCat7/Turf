'use client'

import type MuxPlayerElement from '@mux/mux-player'
import { useEffect, useState } from 'react'
import {
  // @ts-expect-error help
  experimental_useFormState as useFormState,
  // @ts-expect-error help
  experimental_useFormStatus as useFormStatus,
} from 'react-dom'

import { addCuepoint } from '@/app/actions/insert-cuepoint'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

const initialState = {
  message: null,
  cuepoint: null,
  success: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" aria-disabled={pending}>
      Add Event
    </Button>
  )
}

export default function CuepointTag({
  videoId,
  playerRef,
}: {
  videoId: string
  playerRef: React.RefObject<MuxPlayerElement>
}) {
  const [state, formAction] = useFormState(addCuepoint, initialState)
  const [category, setCategory] = useState('goal')
  const { toast } = useToast()

  useEffect(() => {
    if (state.success) {
      const { time, description, playCategory, videoId, taggerId, id } =
        state.cuepoint
      const muxCuepoint = {
        time,
        value: {
          id,
          description,
          playCategory,
          videoId,
          taggerId,
        },
      }
      // add new mux cuepoint to player
      playerRef.current?.addCuePoints([muxCuepoint])

      toast({
        title: 'Event added!',
        description: `Added cuepoint type: ${playCategory} at ${time} seconds.`,
      })
    } else if (state.success === false) {
      toast({
        title: 'Event failed to add!',
        description: state.message,
      })
    }
  }, [state])

  useEffect(() => {
    playerRef.current?.addEventListener('timeupdate', updateCurrentTime)

    return () => {
      playerRef.current?.removeEventListener('timeupdate', updateCurrentTime)
    }
  }, [])

  const [time, setTime] = useState(0)

  const updateCurrentTime = () => {
    const { current } = playerRef
    if (current) {
      console.log('updating the time')
      // Get the current time of the video and update the state
      setTime(playerRef?.current?.currentTime ?? 0)
    }
  }

  requestAnimationFrame(updateCurrentTime)

  return (
    <form action={formAction} className="flex flex-col space-y-4">
      <Label htmlFor="playCategory">Category</Label>
      <Select
        value={category}
        onValueChange={setCategory}
        name="playCategory"
        required
      >
        <p>{time}</p>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Event category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Category</SelectLabel>
            <SelectItem value="goal">Goal</SelectItem>
            <SelectItem value="pass">Pass</SelectItem>
            <SelectItem value="shot">Shot</SelectItem>
            <SelectItem value="save">Save</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Label htmlFor="description">Description</Label>
      <Input type="text" id="description" name="description" required />
      <input
        type="decimal"
        id="time"
        name="time"
        required
        hidden
        value={time}
      />
      <input
        type="text"
        id="videoId"
        name="videoId"
        required
        hidden
        readOnly
        value={videoId}
      />
      <SubmitButton />
    </form>
  )
}
