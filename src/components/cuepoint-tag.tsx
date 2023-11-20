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
import { SelectUsers } from '@/lib/db/schema'

import { Avatar, AvatarImage } from './ui/avatar'
import { Card, CardContent } from './ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Textarea } from './ui/textarea'

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
  teamMembers,
}: {
  videoId: string
  playerRef: React.RefObject<MuxPlayerElement>
  teamMembers: { user: SelectUsers; userId: string; teamId: string }[]
}) {
  const [state, formAction] = useFormState(addCuepoint, initialState)
  const [category, setCategory] = useState('goal')
  const [open, setOpen] = useState(false)
  const [player, setSelectedPlayer] = useState<{
    user: SelectUsers
    userId: string
    teamId: string
  } | null>(null)
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
        description: `Added cuepoint type: ${playCategory} at ${new Date(
          time * 1000
        )
          .toISOString()
          .slice(14, 22)}.`,
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
      // TODO: HACKY AF
      // Get the current time of the video and update the state
      setTime(playerRef?.current?.currentTime ?? 0)
    }
  }

  requestAnimationFrame(updateCurrentTime)

  return (
    <Card>
      <CardContent className="p-4">
        <form action={formAction} className="flex flex-col space-y-4">
          <Label htmlFor="playCategory">Category</Label>
          <Select
            value={category}
            onValueChange={setCategory}
            name="playCategory"
            required
          >
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
                <SelectItem value="tackle">Tackle</SelectItem>
                <SelectItem value="foul">Foul</SelectItem>
                <SelectItem value="corner">Corner</SelectItem>
                <SelectItem value="penalty">Penalty</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Label htmlFor="playCategory">Player</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                aria-label="Select a player"
                className={'w-[200px] justify-between'}
              >
                {player ? (
                  <div className="flex">
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={
                          player.user.avatarUrl ??
                          'https://avatar.vercel.sh/personal.png'
                        }
                      />
                    </Avatar>
                    {player.user.firstName}
                  </div>
                ) : (
                  'Select a player'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandList>
                  <CommandInput placeholder="Search player..." />
                  <CommandEmpty>No players found.</CommandEmpty>
                  <CommandGroup heading="Players">
                    {teamMembers.map((player) => (
                      <CommandItem
                        key={player.userId}
                        className="text-sm"
                        onSelect={() => {
                          setSelectedPlayer(player)
                          setOpen(false)
                        }}
                      >
                        <Avatar className="mr-2 h-5 w-5">
                          <AvatarImage
                            src={
                              player.user.avatarUrl ??
                              'https://avatar.vercel.sh/personal.png'
                            }
                          />
                        </Avatar>
                        {player.user.firstName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="optional description"
          />
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
          <input
            type="text"
            id="playerId"
            name="playerId"
            hidden
            readOnly
            value={player?.userId}
          />
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}
