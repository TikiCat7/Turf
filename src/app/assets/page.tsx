import { auth } from '@clerk/nextjs'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { eq } from 'drizzle-orm'
import {
  BookOpenIcon,
  DownloadIcon,
  // MapPinIcon,
  ScissorsIcon,
  ShareIcon,
} from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

import TimeAgoClient from '@/components/time-ago'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Gallery',
}

export default async function Assets() {
  return (
    <div className="flex-col py-16 w-4/5 space-y-4">
      <div className="text-4xl font-bold mb-4">Video Gallery</div>
      <Input placeholder="search" className="max-w-[275px] md:max-w-[400px]" />
      <Suspense fallback={<AssetLoading />}>
        <div className="flex flex-col space-y-4">
          <AssetsList />
        </div>
      </Suspense>
    </div>
  )
}

// const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function AssetsList() {
  async function getAssets() {
    // await wait(5000)
    // TODO: DRY
    const clerkUser = auth()
    const isPersonal = !clerkUser.sessionClaims?.org_id
    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUser.userId!))

    if (!user || !user[0]) {
      console.log('corresponding user not found!')
      // throw new Error('corresponding user not found!')
      return []
    }

    if (isPersonal) {
      return await db.query.videos.findMany({
        where: (videos, { eq }) => eq(videos.clerkUserId, clerkUser.userId!),
        with: {
          uploader: true,
        },
      })
    }

    return await db.query.videos.findMany({
      where: (videos, { eq }) => eq(videos.clerkTeamId, clerkUser.orgId!),
      with: {
        uploader: true,
      },
    })
  }
  const allAssets = await getAssets()

  return (
    <>
      {allAssets
        .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
        .map((video) => {
          return (
            <div className="flex space-x-2 cursor-pointer" key={video.id}>
              <Link
                href={`assets/${video.assetId}`}
                className="flex flex-col md:flex-row md:space-x-2"
              >
                {video.videoStatus === 'ready' ? (
                  <div className="relative max-w-[299px]">
                    <Image
                      priority={true}
                      alt="video_thumbnail"
                      src={`https://image.mux.com/${video.playbackUrl}/thumbnail.jpg?width=300&fit_mode=pad`}
                      className="rounded-md w-[350px] md:w-[300px]"
                      width={279}
                      height={157}
                    />
                    <Badge className="font-bold text-xs absolute bottom-2 right-2 bg-primary/80">
                      {new Date(video.duration! * 1000)
                        .toISOString()
                        .slice(11, 19)}
                    </Badge>
                    <Badge className="absolute top-2 right-2 bg-primary/80">
                      {video.videoTypeEnum}
                    </Badge>
                  </div>
                ) : (
                  <div className="bg-gray-400/50 w-[300px] h-[157px] rounded-md relative">
                    <Badge className="top-2 right-2 absolute bg-primary/80">
                      Preparing
                    </Badge>
                  </div>
                )}
                <div className="flex flex-col md:w-[400px]">
                  <div className="flex space-x-4 items-center justify-between">
                    <p className="lg:text-xl font-semibold">
                      {video.videoName}
                    </p>
                  </div>

                  <div className="flex items-start space-y-2 pt-1 flex-col">
                    <div className="flex justify-between w-full items-center">
                      <div className="flex items-start flex-col">
                        <div className="text-muted-foreground">
                          <TimeAgoClient
                            date={video.createdAt}
                            locale="en-US"
                          />
                        </div>
                        <div className="flex items-center">
                          <Avatar className="w-5 h-5 mr-1">
                            <AvatarImage
                              src={
                                video.uploader.avatarUrl
                                  ? video.uploader.avatarUrl
                                  : 'https://avatar.vercel.sh/personal.png'
                              }
                            />
                            <AvatarFallback />
                          </Avatar>
                          <p className="w-8">{video.uploader.firstName}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost">
                            <span className="sr-only">Actions</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="space-x-2">
                            <DownloadIcon className="h4 w-4" />
                            <p>Download Video</p>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="space-x-2" disabled>
                            <ShareIcon className="w-4 h-4" />
                            <p>Share</p>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="space-x-2" disabled>
                            <ScissorsIcon className="h-4 w-4" />
                            <p>Clip</p>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="space-x-2" disabled>
                            <BookOpenIcon className="h-4 w-4" />
                            <p>Match Info</p>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      {allAssets.length === 0 && (
        <p>
          No Videos uploaded. <Link href="/uploads">Upload here.</Link>
        </p>
      )}
    </>
  )
}

function AssetLoading() {
  return (
    <div className="flex flex-col space-y-4">
      {[...Array(10)].map((_, i) => (
        <div className="max-w-[299px] flex space-x-2 items-start" key={i}>
          <div>
            <Skeleton className="rounded-md w-[300px] h-[157px]" />
          </div>
          <div className="flex space-y-2 flex-col">
            <Skeleton className="w-[250px] h-[20px] rounded-md" />
            <Skeleton className="w-[250px] h-[20px] rounded-md" />
            <Skeleton className="w-[25px] h-[25px] rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
