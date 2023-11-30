import { auth, currentUser } from '@clerk/nextjs'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { MagicCard, MagicContainer } from '@/components/magicui/magic-card'
import Marquee from '@/components/magicui/marquee'
import { Button } from '@/components/ui/button'

const teams = [
  {
    name: 'Big Poppas',
    username: '@BigPoppas_FC',
    body: 'Big Poppas is an amateur team in Singapore.',
    img: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJZVE80NlFMY2ZBcENDT1JEcWg5aFRHSEZSZyJ9',
  },
  {
    name: 'Lads on Toure',
    username: '@LadsOnToure_FC',
    body: 'Lads On Toure is an amateur team in Singapore.',
    img: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJZVGFGOXZ2dWxHNEI0YjkyVnN6WnZGcVRYQyJ9',
  },
  {
    name: 'FootballCom',
    username: '@FootballCom',
    body: 'FootballCom is a recreational group that plays in Singapore.',
    img: 'https://avatar.vercel.sh/john',
  },
  {
    name: 'Team A',
    username: '@TeamA_FC',
    body: 'TeamA is an amateur team in Singapore.',
    img: 'https://avatar.vercel.sh/jane',
  },
  {
    name: 'Team B',
    username: '@TeamB_FC',
    body: 'Team B is an amateur team in Singapore.',
    img: 'https://avatar.vercel.sh/jenny',
  },
]

const TeamCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <figure
      className={
        'relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4 border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]'
      }
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  )
}

export const metadata: Metadata = {
  title: 'Create Team',
}
export default async function Home() {
  const user = await currentUser()
  const clerkUser = auth()

  if (!user) {
    return redirect('/sign-in')
  }

  // if already in a team and it's active, redirect to team page
  if (clerkUser.sessionClaims?.org_id) {
    redirect('/team')
  }

  // TODO: this page should be the landing page for new users. guide them on creating a new team or show them how to upload a video for personal gallery
  return (
    <div className="flex flex-col items-center justify-center pt-4">
      <div className="p-8">
        <div className="flex items-center flex-col xs:flex-row xs:space-x-2">
          <h1 className="text-4xl font-bold">Welcome to</h1>
          <Image
            className="mr-4"
            alt="turf app logo"
            src="/logo-no-background.png"
            width={75}
            height={30}
          />
        </div>
        <h2 className="text-muted-foreground py-4">
          Turf is a better way to manage your grass roots team.
        </h2>
        <div className="flex md:space-x-4 flex-col md:flex-row">
          <div>
            <p className="font-bold mt-2">Available features ✅</p>
            <ul className="list-disc text-muted-foreground text-sm mt-2 ml-5">
              <li>Create a team, invite members</li>
              <li>Video uploads</li>
              <li>Video gallery / video player</li>
              <li>Tagging Video events (manual)</li>
            </ul>
          </div>

          <div>
            <p className="font-bold mt-2">Features in development ⚙️</p>
            <ul className="list-disc text-muted-foreground text-sm mt-2 ml-5">
              <li>Team announcements</li>
              <li>Schedule upcoming sessions</li>
              <li>Collect attendance</li>
              <li>Payment status</li>
              <li>Team chat</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="pb-8 flex flex-col">
        <div className="flex items-center space-x-2 justify-center">
          <p className="text-2xl font-bold">Teams using</p>
          <Image
            className="mr-4"
            alt="turf app logo"
            src="/logo-no-background.png"
            width={60}
            height={25}
          />
        </div>

        <div className="relative flex h-full w-[400px] xs:w-[500px] sm:w-[650px] md:w-[750px] flex-col items-center justify-center gap-4 overflow-hidden rounded-lg py-4">
          <Marquee pauseOnHover className="[--duration:30s]">
            {teams.map((team) => (
              <TeamCard key={team.username} {...team} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
        </div>
      </div>
      <div className="flex px-8 md:space-x-4 md:flex-row flex-col space-y-4 md:space-y-0 pb-8">
        <MagicContainer
          className={
            'flex h-[250px] max-w-[400px] flex-col gap-4 lg:flex-row pb-4 md:pb-0'
          }
        >
          <MagicCard
            borderWidth={3}
            className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden dark:bg-[radial-gradient(var(--mask-size)_circle_at_var(--mouse-x)_var(--mouse-y),#ffaa40_0,#9c40ff_50%,transparent_100%)] md:p-10 p-4"
          >
            <p className="text-2xl font-bold pb-4">Create a team</p>
            <h2 className="pb-4 text-muted-foreground">
              Create a new team on Turf to manage. Invite team members via
              email.
            </h2>
            <div className="items-start flex justify-end">
              <Link href="/create-team">
                <Button>Create a team</Button>
              </Link>
            </div>
          </MagicCard>
        </MagicContainer>
        <MagicContainer
          className={'flex h-[250px] max-w-[400px] flex-col gap-4 lg:flex-row'}
        >
          <MagicCard
            borderWidth={3}
            className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden dark:bg-[radial-gradient(var(--mask-size)_circle_at_var(--mouse-x)_var(--mouse-y),#ffaa40_0,#9c40ff_50%,transparent_100%)] md:p-10 p-4"
          >
            <p className="text-2xl font-bold pb-4">Join a team</p>
            <h1 className="text-muted-foreground">
              Already part of a team that's on Turf? Please contact the team
              organiser and request to join the team. You will receive an
              invitation email to join.
            </h1>
          </MagicCard>
        </MagicContainer>
      </div>
    </div>
  )
}
