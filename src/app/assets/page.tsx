import { UserButton, auth } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import Image from 'next/image'
import Link from 'next/link'

import { db } from '@/lib/db'
import { SelectVideo, users } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

async function getAssets() {
  // TODO: DRY
  const clerkUser = auth()
  const user = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUser.userId!))

  if (!user || !user[0]) {
    console.log('corresponding user not found!')
    throw new Error('corresponding user not found!')
  }

  return await db.query.videos.findMany({
    where: (videos, { eq }) => eq(videos.userId, user[0].id),
  })
}

export default async function Assets() {
  const allAssets = await getAssets()
  console.log('allAssets: ', allAssets)
  return (
    <div className="w-full flex items-center justify-center flex-col">
      <div className="h-8">
        <UserButton afterSignOutUrl="/" />
      </div>
      <div className="text-4xl font-bold mb-4">My Uploads</div>
      <div className="flex flex-col">
        {allAssets.length > 0 ? (
          allAssets.map((asset: SelectVideo) => (
            <Link
              key={asset.assetId}
              href={`assets/${asset.assetId}`}
              className="flex items-center h-[128px]"
            >
              <Image
                priority={true}
                alt="video_thumbnail"
                src={`https://image.mux.com/${asset.playbackUrl}/thumbnail.jpg?width=128&fit_mode=pad`}
                className="rounded-md"
                width={128}
                height={128}
              />
              <pre>id: {asset.assetId}</pre>
            </Link>
          ))
        ) : (
          <>
            <p>0 videos found</p>
            <Link href="/uploads">Upload a video</Link>
          </>
        )}
      </div>
    </div>
  )
}
