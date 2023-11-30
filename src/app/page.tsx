import { auth, currentUser } from '@clerk/nextjs'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import HeaderLeftContent from '@/components/header-left-content'
import HeaderRightContent from '@/components/header-right-content'
import PaymentCollectionCard from '@/components/payment-collection-card'
import ScheduleCard from '@/components/schedule-card'
import SocialContent from '@/components/social-content'
import TaggingContent from '@/components/tagging-content'
import { ModeToggle } from '@/components/theme-toggle'
import VideoUploadCard from '@/components/video-upload-card'

export const metadata: Metadata = {
  title: 'Turf',
  creator: '@_WataruIkeda',
  twitter: { images: [{ url: '/', width: 1200, height: 600 }] },
}
export default async function Home() {
  const user = await currentUser()
  const clerkUser = auth()

  // if already in a team and it's active, redirect to team page
  if (clerkUser.sessionClaims?.org_id) {
    redirect('/team')
  }

  // if signed in but not in a team, redirect to welcome page
  if (user) {
    return redirect('/welcome')
  }

  // TODO: this page should be the landing page for new users. guide them on creating a new team or show them how to upload a video for personal gallery
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="p-2 md:p-8 w-screen items-center justify-center flex flex-col">
        <div className="flex md:px-20 px-8 py-2 md:py-2 justify-between items-center w-full max-w-5xl item-center">
          <div className="h-[50px] w-[50px] md:h-[70px] md:w-[70px] lg:w-[120px] flex items-center justify-between">
            <Image
              alt="turf logo"
              src="/logo-no-background.png"
              width={120}
              height={60}
              priority
            />
          </div>
          <Link href="/sign-in">
            <p className="md:block text-[#009B7D] font-bold lg:text-xl cursor-pointer hover:bg-[#006E59] hover:rounded-full p-4 hover:text-white">
              Sign In
            </p>
          </Link>
        </div>
        <div className="md:mt-4 flex items-center flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-8 px-10 lg:pt-[80px] w-full justify-center">
          <HeaderLeftContent />
          <HeaderRightContent />
        </div>
        <SocialContent />
        {/* <div className="bg-header-pattern h-[200px] my-10" /> */}
        <div className="px-10 mt-[100px] flex justify-center max-w-6xl w-full flex-col md:flex-row space-y-8 md:space-y-0">
          <div className="flex flex-col w-full">
            <h2 className="text-4xl font-bold text-turf-light dark:text-turf-dark">
              Simplify scheduling
            </h2>
            <p className="text-muted-foreground lg:text-xl font-medium py-2">
              Create upcoming schedules for your team, track participation and
              more.
            </p>
          </div>
          <div className="flex items-center w-full justify-center space-x-8">
            <ScheduleCard />
          </div>
        </div>
        <div className="px-10 mt-[50px] items-start flex max-w-6xl w-full flex-col md:flex-row space-y-8 md:space-y-0">
          <div className="flex flex-col h-full justify-start flex-1 w-full pt-6">
            <h2 className="text-4xl font-bold text-turf-light dark:text-turf-dark">
              Automate payment collection
            </h2>
            <p className="text-muted-foreground lg:text-xl font-medium py-2">
              Create payment requests from team members and track the
              settlement.
            </p>
          </div>
          <div className="flex flex-1 items-center w-full justify-center space-x-8">
            <PaymentCollectionCard />
          </div>
        </div>
        <div className="px-10 mt-[50px] flex flex-col justify-center max-w-6xl w-full">
          <h2 className="text-4xl font-bold text-turf-light dark:text-turf-dark">
            Create a digital gallery
          </h2>
          <p className="text-muted-foreground lg:text-xl font-medium py-2">
            Dedicated video hosting so you can create a digital gallery for your
            team.
          </p>
          <div className="flex items-center w-full justify-center space-x-8">
            <VideoUploadCard />
          </div>
        </div>
        <TaggingContent />
        <div className="flex justify-between p-8 items-center space-x-4">
          <p className="text-muted-foreground">Turf 2023</p>
          <div>
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}
