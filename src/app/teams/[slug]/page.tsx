import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

async function getTeamData(slug: string) {
  const team = await db.query.teams.findFirst({
    where: (teams, { eq }) => eq(teams.slug, slug),
    with: {
      usersToTeams: {
        with: {
          user: true,
        },
      },
      videos: true,
    },
  })

  const memberCount = team?.usersToTeams.length
  return { ...team, memberCount }
}
export default async function Assets({ params }: { params: { slug: string } }) {
  const { orgSlug } = auth()
  if (orgSlug !== params.slug) {
    redirect('/teams')
  }

  const { memberCount, videos, usersToTeams, name, createdAt } =
    await getTeamData(params.slug)
  return (
    <section>
      <p>team slug: {params.slug}</p>
      <p>team name: {name}</p>
      <p>member count: {memberCount}</p>
      <p>created: {new Date(createdAt!).toLocaleDateString()}</p>
      <p className="text-bold text-2xl py-2">Videos</p>
      {videos?.map((video) => <p>Video Upload: {video.uploadId}</p>)}
      <p className="text-bold text-2xl py-2">Members</p>
      {usersToTeams?.map((member) => (
        <p>{member.user.firstName! + ' ' + member.user.lastName!}</p>
      ))}
    </section>
  )
}
