import { auth, currentUser } from '@clerk/nextjs'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import TeamCreationFormWrapper from '@/components/team-creation-form-wrapper'

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
    <div className="w-full items-center text-sm flex h-full flex-col">
      <p className="pl-4 font-bold text-2xl pt-8">New team</p>
      <p className="text-sm text-muted-foreground">
        Create a team to start uploading videos
      </p>
      <TeamCreationFormWrapper />
    </div>
  )
}
