'use client'

import type MuxPlayerElement from '@mux/mux-player'
import { useEffect, useRef, useState } from 'react'

import VideoPlayer from '@/components/mux-player'
import { Cuepoints, SelectUsers } from '@/lib/db/schema'

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
  return cuepoints
    .sort((a, b) => (a.time > b.time ? 1 : -1))
    .map((cuepoint) => {
      const { time, description, playCategory, videoId, taggerId, id } =
        cuepoint
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
  duration,
  teamMembers,
}: {
  assetId: string
  playbackUrl: string
  cuepoints: Cuepoints[]
  duration: number
  teamMembers: { user: SelectUsers; userId: string; teamId: string }[]
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
    <VideoPlayer
      playerRef={playerRef}
      videoId={assetId}
      playbackId={playbackUrl}
      muxCuepoints={formateCuepoints(_cuepoints)}
      duration={duration}
      teamMembers={teamMembers}
    />
  )
}
