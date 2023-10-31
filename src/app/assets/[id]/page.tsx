import Player from '@/components/mux-player'
import { db } from '@/lib/db'
import { UserButton } from '@clerk/nextjs'

async function getAsset(assetId: string) {
  return await db.query.videos.findFirst({
    where: (videos, { eq }) => eq(videos.assetId, assetId),
    with: {
      uploader: {
        columns: {
          firstName: true,
          lastName: true,
          email: true,
        },
        with: {
          usersToTeams: true,
        },
      },
      team: true,
    },
  })
}

async function VideoSection({ videoId }: { videoId: string }) {
  const asset = await getAsset(videoId)
  console.log('asset: ', asset)
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
      {asset ? (
        <>
          <div>Asset Playback ID: {asset.playbackUrl}</div>
          <Player playbackId={asset.playbackUrl ?? ''} />
        </>
      ) : (
        <p>Video not found</p>
      )}
    </div>
  )
}

export default async function Assets({ params }: { params: { id: string } }) {
  return (
    <section>
      <VideoSection videoId={params.id} />
    </section>
  )
}
