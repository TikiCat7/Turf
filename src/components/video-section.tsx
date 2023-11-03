'use client'

import type MuxPlayerElement from '@mux/mux-player'
import { useEffect, useRef, useState } from 'react'

import AddCuepoint from '@/components/add-cuepoint'
import VideoPlayer from '@/components/mux-player'
import { Cuepoints } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

export interface MuxCuePointData {
  time: number
  value: {
    id: string
    description: string | null
    playCategory: string
    videoId: string
    taggerId: string
  }
}

const formateCuepoints = (cuepoints: Cuepoints[]): MuxCuePointData[] => {
  if (!cuepoints) {
    return []
  }
  return cuepoints.map((cuepoint) => {
    const { time, description, playCategory, videoId, taggerId, id } = cuepoint
    return {
      time,
      value: {
        id,
        description,
        playCategory,
        videoId,
        taggerId,
      },
    }
  })
}

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
  const [_cuepoints, setCuepoints] = useState<Cuepoints[]>(cuepoints)

  useEffect(() => {
    if (cuepoints.length === _cuepoints.length) {
      return
    }
    setCuepoints(cuepoints)
  }, [cuepoints])

  return (
    <div>
      <VideoPlayer
        playerRef={playerRef}
        playbackId={playbackUrl}
        muxCuepoints={formateCuepoints(_cuepoints)}
      />
      <AddCuepoint videoId={assetId} playerRef={playerRef} />
    </div>
  )
}
