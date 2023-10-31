import { db } from '@/lib/db'
import { teams, users, usersOnTeams, videos } from '@/lib/db/schema'
import { currentUser } from '@clerk/nextjs'
import { eq, sql } from 'drizzle-orm'
import { redirect } from 'next/navigation'

async function getUser() {
  const user = await currentUser()
  if (!user) {
    redirect('/sign-in')
  }
  const result = await db
    .select()
    .from(users)
    // current user
    .where(eq(users.clerkId, user.id))
    // join user and teams
    .innerJoin(usersOnTeams, eq(users.clerkId, usersOnTeams.userId))
  console.log('result of join: ', result)

  const result2 = await db
    .select()
    .from(usersOnTeams)
    .innerJoin(users, eq(usersOnTeams.userId, users.clerkId))
    .where(eq(users.clerkId, user.id))
    .innerJoin(teams, eq(usersOnTeams.teamId, teams.clerkId))
    .innerJoin(videos, eq(videos.userId, users.id))
    .where(eq(videos.userId, users.id))

  console.log('result2: ', result2)

  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.clerkId, user.id),
    with: {
      videos: true,
      usersToTeams: {
        with: {
          team: true,
        },
      },
    },
  })
}

export default async function User() {
  const user = await getUser()
  return (
    <section className="max-w-[80%]">
      <pre className="overflow-scroll">{JSON.stringify(user, null, 2)}</pre>
    </section>
  )
}
