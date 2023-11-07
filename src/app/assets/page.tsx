import { auth, currentUser } from '@clerk/nextjs'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { eq } from 'drizzle-orm'
import {
  BookOpenIcon,
  DownloadIcon,
  // MapPinIcon,
  ScissorsIcon,
  ShareIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

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
import { db } from '@/lib/db'
import { SelectVideo, users } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

async function getAssets() {
  // TODO: DRY
  const clerkUser = auth()
  const isPersonal = !clerkUser.sessionClaims?.org_id
  const user = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.userId!))

  if (!user || !user[0]) {
    console.log('corresponding user not found!')
    throw new Error('corresponding user not found!')
  }

  if (isPersonal) {
    return await db.query.videos.findMany({
      where: (videos, { eq }) => eq(videos.clerkUserId, clerkUser.userId!),
    })
  }

  return await db.query.videos.findMany({
    where: (videos, { eq }) => eq(videos.clerkTeamId, clerkUser.orgId!),
  })
}

export default async function Assets() {
  const allAssets = await getAssets()
  const user = await currentUser()
  return (
    <div className="flex-col py-16 w-4/5 space-y-4">
      <div className="text-4xl font-bold mb-4">Video Gallery</div>
      <Input placeholder="search" className="max-w-[275px] md:max-w-[400px]" />
      <div className="flex flex-col space-y-4">
        {allAssets
          .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
          .map((video: SelectVideo) => {
            return (
              <VideoRow
                key={video.id}
                video={video}
                userImageUrl={user?.imageUrl}
                userName={user?.firstName ?? ''}
              />
            )
          })}
        {allAssets.length === 0 && (
          <p>
            No Videos uploaded. <Link href="/uploads">Upload here.</Link>
          </p>
        )}
      </div>
    </div>
  )
}

function VideoRow({
  video,
  userImageUrl,
  userName,
}: {
  video: SelectVideo
  userImageUrl: string | undefined
  userName: string
}) {
  return (
    <div className="flex space-x-2 cursor-pointer">
      <Link
        href={`assets/${video.assetId}`}
        className="flex flex-col md:flex-row md:space-x-2"
      >
        {video.videoStatus === 'ready' ? (
          <div className="relative">
            <Image
              priority={true}
              alt="video_thumbnail"
              src={`https://image.mux.com/${video.playbackUrl}/thumbnail.jpg?width=300&fit_mode=pad`}
              className="flex rounded-md"
              width={279}
              height={157}
            />
            <Badge className="font-bold text-xs absolute bottom-2 right-2 bg-primary/80">
              {new Date(video.duration! * 1000).toISOString().slice(11, 19)}
            </Badge>
            <Badge className="absolute top-2 right-2 bg-primary/80">
              {video.videoTypeEnum}
            </Badge>
          </div>
        ) : (
          <div className="bg-gray-400 w-[279px] h-[157px] rounded-md" />
        )}
        <div className="flex flex-col md:w-[400px]">
          <div className="flex space-x-4 items-center justify-between">
            <p className="lg:text-xl font-semibold">{video.videoName}</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <span className="sr-only">Actions</span>
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="space-x-2">
                  <ShareIcon className="w-4 h-4" />
                  <p>Share</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="space-x-2">
                  <DownloadIcon className="h4 w-4" />
                  <p>Download Video</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="space-x-2">
                  <ScissorsIcon className="h-4 w-4" />
                  <p>Clip</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="space-x-2">
                  <BookOpenIcon className="h-4 w-4" />
                  <p>Match Info</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="text-muted-foreground">
            <TimeAgoClient date={video.createdAt} locale="en-US" />
          </div>
          <div className="flex items-center space-x-1 pt-1">
            <div className="flex flex-col">
              <div className="flex items-center">
                <Avatar className="w-5 h-5 mr-1">
                  <AvatarImage
                    src={
                      userImageUrl
                        ? userImageUrl
                        : 'https://avatar.vercel.sh/personal.png'
                    }
                  />
                  <AvatarFallback />
                </Avatar>
                <p className="w-8">{userName}</p>
              </div>
              <div>
                {/* <p> */}
                {/*   {video.videoDate.toLocaleDateString() + */}
                {/*     ' ' + */}
                {/*     video.videoDate.toLocaleTimeString()} */}
                {/* </p> */}
                {/* <div className="flex items-center text-xs text-muted-foreground"> */}
                {/*   <MapPinIcon className="w-3 h-3" /> */}
                {/*   {video.videoLocation} */}
                {/* </div> */}
              </div>
            </div>
            {video.videoStatus === 'preparing' && <Badge>Preparing</Badge>}
          </div>
        </div>
      </Link>
    </div>
  )
}
