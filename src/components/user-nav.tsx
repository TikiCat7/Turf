import { auth, clerkClient, currentUser } from '@clerk/nextjs'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

import SignoutButton from '@/components/signout-button'
import TeamList from '@/components/team-list'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

async function getTeams() {
  const user = auth()
  const memberships = await clerkClient.users.getOrganizationMembershipList({
    userId: user.userId!,
  })

  return memberships.map((team) => {
    return {
      id: team.organization.id,
      label: team.organization.name,
      value: team.organization.slug,
      imageUrl: team.organization.imageUrl,
    }
  })
}

export async function UserNav() {
  const user = await currentUser()
  const teams = await getTeams()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.imageUrl} alt="avatar image" />
            <AvatarFallback>{user?.firstName?.slice(0, 1)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.emailAddresses[0].emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/team">
            <DropdownMenuItem>Team</DropdownMenuItem>
          </Link>
          <Link href="/uploads">
            <DropdownMenuItem>Upload</DropdownMenuItem>
          </Link>
          <Link href="/assets">
            <DropdownMenuItem>Gallery</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="border-none">
            <DropdownMenuLabel>My Teams</DropdownMenuLabel>
            <TeamList teams={teams} />
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <Link href="/create-team" className="flex items-center">
              <DropdownMenuItem className="w-full">
                <PlusCircledIcon className="mr-2 h-5 w-5" />
                <p>Create team</p>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <Link href="/team/manage">
            <DropdownMenuItem>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <SignoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
