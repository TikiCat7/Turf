'use client'

import { useOrganization, useOrganizationList, useUser } from '@clerk/nextjs'
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface TeamSwitcherProps extends PopoverTriggerProps {
  teams: {
    id: string | null
    label: string | null
    value: string | null
    imageUrl: string | undefined
  }[]
}

export default function TeamSwitcher({ className, teams }: TeamSwitcherProps) {
  const user = useUser()
  const org = useOrganization()
  const { setActive, isLoaded } = useOrganizationList()
  const [open, setOpen] = useState(false)
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState({
    id: '',
    label: '',
    value: '',
    imageUrl: '',
  })

  useEffect(() => {
    setSelectedTeam({
      id: org.organization?.id ?? user.user?.id ?? '',
      label:
        org.organization?.name ??
        user.user?.firstName + ' ' + user.user?.lastName,
      value: org.organization?.slug ? 'team' : 'personal',
      imageUrl: org.organization?.imageUrl ?? user.user?.imageUrl ?? '',
    })
  }, [org.organization])

  if (!isLoaded) return null

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn('w-[200px] justify-between', className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={
                  org.organization
                    ? selectedTeam.imageUrl
                    : `https://avatar.vercel.sh/personal.png`
                }
                alt={selectedTeam.imageUrl}
              />
              <AvatarFallback>
                {user.user?.firstName?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            {selectedTeam.label}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No team found.</CommandEmpty>
              <CommandGroup heading={'Personal'} key={'personal'}>
                <CommandItem
                  key={'personal'}
                  className="text-sm"
                  onSelect={() => {
                    setSelectedTeam({
                      id: user.user?.id ?? '',
                      label: user.user?.firstName + ' ' + user.user?.lastName,
                      value: 'personal',
                      imageUrl: user.user?.imageUrl ?? '',
                    })
                    setOpen(false)
                    setActive({ organization: null })
                  }}
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/personal.png`}
                      alt={'personal'}
                      // className="grayscale"
                    />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  {user.user?.firstName + ' ' + user.user?.lastName}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      selectedTeam.value === 'personal'
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              </CommandGroup>
              <CommandGroup heading="Team">
                {teams.map((team) => (
                  <CommandItem
                    key={team.label}
                    className="text-sm"
                    onSelect={() => {
                      setSelectedTeam({
                        id: team.id ?? '',
                        value: team.value ?? '',
                        label: team.label ?? '',
                        imageUrl: team.imageUrl ?? '',
                      })
                      setOpen(false)
                      setActive({ organization: team.id })
                    }}
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={team.imageUrl}
                        alt={team.value!}
                        // className="grayscale"
                      />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    {team.value}
                    <CheckIcon
                      className={cn(
                        'ml-auto h-4 w-4',
                        selectedTeam.label === team.label
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false)
                      setShowNewTeamDialog(true)
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>
            Add a new team to manage products and customers.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team name</Label>
              <Input id="name" placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">
                    <span className="font-medium">Free</span> -{' '}
                    <span className="text-muted-foreground">
                      Trial for two weeks
                    </span>
                  </SelectItem>
                  <SelectItem value="pro">
                    <span className="font-medium">Pro</span> -{' '}
                    <span className="text-muted-foreground">
                      $9/month per user
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
            Cancel
          </Button>
          <Button type="submit">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
