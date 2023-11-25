'use client'

import { useOrganizationList } from '@clerk/nextjs'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

interface Team {
  id: string
  label: string
  value: string | null
  imageUrl: string
}

export default function TeamList({ teams }: { teams: Team[] }) {
  const { setActive } = useOrganizationList()
  return (
    <>
      {teams.map((team) => {
        return (
          <DropdownMenuItem
            onClick={() => setActive!({ organization: team.id })}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage src={team.imageUrl} alt={team.value!} />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {team.value}
          </DropdownMenuItem>
        )
      })}
    </>
  )
}
