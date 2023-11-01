import { UserButton } from '@clerk/nextjs'

import AddCuepoint from '@/components/add-cuepoint'
import CuepointList from '@/components/cuepoint-list'
import VideoPlayer from '@/components/mux-player'
import { db } from '@/lib/db'

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
      cuepoints: true,
    },
  })
}

export default async function AssetsPage({
  params,
}: {
  params: { id: string }
}) {
  const asset = await getAsset(params.id)

  return (
    <section>
      <div>
        <UserButton afterSignOutUrl="/" />
        {asset ? (
          <>
            <div>Asset Playback ID: {asset.playbackUrl}</div>
            <VideoPlayer playbackId={asset.playbackUrl ?? ''} />
            <AddCuepoint videoId={asset.id} />
            <CuepointList cuepoints={asset.cuepoints} />
          </>
        ) : (
          <p>Video not found</p>
        )}
      </div>
    </section>
  )
}
