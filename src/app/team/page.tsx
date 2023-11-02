import { OrganizationSwitcher, auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'

async function getTeam() {
  const { orgSlug } = auth()
  if (!orgSlug) {
    redirect('/')
  }
  return await db.query.teams.findFirst({
    where: (teams, { eq }) => eq(teams.slug, orgSlug),
    with: {
      videos: true,
      usersToTeams: {
        with: {
          user: true,
        },
      },
    },
  })
}

export default async function Team() {
  const team = await getTeam()
  return (
    <div className="flex-col">
      <OrganizationSwitcher />
      <h1>You belong to team {team?.slug}</h1>
      <p>Videos</p>
      <pre>{JSON.stringify(team?.videos, null, 2)}</pre>
      <p>Members</p>
      <pre>{JSON.stringify(team?.usersToTeams, null, 2)}</pre>
    </div>
  )
}
