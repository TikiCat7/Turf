import { auth, clerkClient } from '@clerk/nextjs'

import TeamSwitcher from '@/components/team-switcher'

export const dynamic = 'force-dynamic'

export default async function TeamSelection() {
  const user = auth()

  const memberships = await clerkClient.users.getOrganizationMembershipList({
    userId: user.userId!,
  })

  const teams = memberships.map((team) => {
    return {
      id: team.organization.id,
      label: team.organization.name,
      value: team.organization.slug,
      imageUrl: team.organization.imageUrl,
    }
  })

  return <TeamSwitcher teams={teams} />
}
