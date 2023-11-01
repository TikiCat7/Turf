import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'

import { db } from '@/lib/db'
import { SelectVideo } from '@/lib/db/schema'

async function getAssets() {
  console.log('fetching videos directly cuz fuck API ROUTES')
  return await db.query.videos.findMany()
}

export default async function Assets() {
  const allAssets = await getAssets()
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
      <div className="text-4xl font-bold mb-4">All Assets</div>
      <div className="flex flex-col space-y-4">
        {allAssets.length > 0 ? (
          allAssets.map((asset: SelectVideo) => (
            <Link
              key={asset.assetId}
              href={`assets/${asset.assetId}`}
              className="flex items-center space-x-2"
            >
              <Image
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
