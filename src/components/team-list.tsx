'use client'

import { useOrganization, useOrganizationList } from '@clerk/nextjs'
import { CheckIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface Team {
  id: string
  label: string
  value: string | null
  imageUrl: string
}

export default function TeamList({ teams }: { teams: Team[] }) {
  const { setActive } = useOrganizationList()
  const org = useOrganization()
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
            <CheckIcon
              className={cn(
                'ml-auto h-4 w-4',
                org.organization?.name === team.label
                  ? 'opacity-100'
                  : 'opacity-0'
              )}
            />
          </DropdownMenuItem>
        )
      })}
    </>
  )
}
