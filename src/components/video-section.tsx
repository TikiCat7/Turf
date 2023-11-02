'use client'

import type MuxPlayerElement from '@mux/mux-player'
import { useRef } from 'react'

import AddCuepoint from '@/components/add-cuepoint'
import VideoPlayer from '@/components/mux-player'
import { Cuepoints } from '@/lib/db/schema'

export default function VideoSection({
  assetId,
  playbackUrl,
  cuepoints,
}: {
  assetId: string
  playbackUrl: string
  cuepoints: Cuepoints[]
}) {
  const playerRef = useRef<MuxPlayerElement>(null)
  return (
    <div>
      <VideoPlayer
        playerRef={playerRef}
        playbackId={playbackUrl}
        cuepoints={cuepoints}
      />
      <AddCuepoint videoId={assetId} />
    </div>
  )
}
