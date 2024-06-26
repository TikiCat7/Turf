import { auth } from '@clerk/nextjs'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  BookOpenIcon,
  DownloadIcon,
  ScissorsIcon,
  ShareIcon,
} from 'lucide-react'
import { Metadata, ResolvingMetadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import VideoSection from '@/components/video-section'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id
  const asset = await getAsset(id)
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []

  // TODO: Test open graph, maybe doesn't work for authed routes
  return {
    title: `${asset?.videoName}`,
    description: `Team ${asset?.team.slug} video, ${asset?.videoDescription}`,
    openGraph: {
      type: 'video.other',
      siteName: 'turf.futbol',
      description: asset?.videoDescription,
      title: asset?.videoName,
      images: [
        `https://image.mux.com/${asset?.playbackUrl}/thumbnail.jpg`,
        ...previousImages,
      ],
    },
  }
}

async function getAsset(assetId: string) {
  return await db.query.videos.findFirst({
    where: (videos, { eq }) => eq(videos.assetId, assetId),
    with: {
      uploader: {
        columns: {
          firstName: true,
          lastName: true,
          email: true,
          avatarUrl: true,
        },
        with: {
          usersToTeams: true,
        },
      },
      team: {
        with: {
          usersToTeams: {
            with: { user: true },
          },
        },
      },
      cuepoints: true,
    },
  })
}

export default async function AssetsPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <Suspense fallback={<AssetLoading />}>
      <AssetInfo id={params.id} />
    </Suspense>
  )
}

async function AssetInfo(props: { id: string }) {
  const asset = await getAsset(props.id)
  const user = auth()

  if (asset?.clerkTeamId !== user.sessionClaims?.org_id) {
    redirect('/assets')
  }

  return (
    <section className="w-full p-8">
      <div className="flex justify-between items-start">
        <div className="space-y-1 pb-2">
          <Badge className="">{asset?.videoTypeEnum}</Badge>
          <h1 className="text-2xl font-bold">{asset?.videoName}</h1>
          <div className="flex items-start flex-col pb-2">
            <div className="flex items-start flex-col">
              <h1 className="text-muted-foreground">
                {asset?.videoDescription}
              </h1>
              <div className="flex items-center space-x-2">
                <h1 className="text-muted-foreground text-sm">
                  {asset?.videoLocation}
                </h1>
                {asset?.videoDate && (
                  <h1 className="text-muted-foreground text-sm">
                    {new Date(asset?.videoDate).toLocaleDateString()}
                  </h1>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:hidden block">
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

      {asset ? (
        <VideoSection
          teamMembers={asset.team.usersToTeams}
          duration={asset.duration!}
          assetId={asset.id}
          playbackUrl={asset.playbackUrl || ''}
          cuepoints={asset.cuepoints}
        />
      ) : (
        <p>Video not found</p>
      )}
    </section>
  )
}

function AssetLoading() {
  return (
    <section className="w-full p-8">
      <div className="flex justify-between items-start">
        <div className="space-y-2 pb-2">
          <Skeleton className="w-[80px] h-4 rounded-md" />
          <Skeleton className="w-[100px] h-4" />
          <Skeleton className="w-[100px] h-4" />
          <Skeleton className="w-[100px] h-4" />
        </div>
        <div className="flex space-x-1 py-2 px-4 h-[36px] w-[48px] items-center justify-center">
          <Skeleton className="w-[4px] h-[4px] rounded-full" />
          <Skeleton className="w-[4px] h-[4px] rounded-full" />
          <Skeleton className="w-[4px] h-[4px] rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-10 gap-4 mt-4">
        <div className="lg:col-span-7 col-span-10">
          <Skeleton className="w-full h-[250px] md:h-[519px] lg:h-[420px]" />
          <div className="flex space-x-2 mt-2">
            <Skeleton className="w-[89px] h-9" />
            <Skeleton className="w-[50px] h-9" />
          </div>
        </div>
        <Skeleton className="col-span-10 lg:col-span-3 h-[160px] lg:h-[210px]" />
      </div>
    </section>
  )
}
