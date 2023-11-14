import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

import VideoSection from '@/components/video-section'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

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
  const user = auth()

  if (asset?.clerkTeamId !== user.sessionClaims?.org_id) {
    redirect('/assets')
  }

  return (
    <section className="w-full p-8">
      {asset ? (
        <VideoSection
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
