'use client'

import type MuxPlayerElement from '@mux/mux-player'
import MuxPlayer from '@mux/mux-player-react'
import { useState } from 'react'

import { Cuepoints } from '@/lib/db/schema'

interface CuePointData {
  time: number
  value: {
    id: string
    description: string
    playCategory: string
    videoId: string
    taggerId: string
  }
}

const formateCuepoints = (cuepoints: Cuepoints[]) => {
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

export default function VideoPlayer({
  playbackId,
  cuepoints,
  playerRef,
}: {
  playbackId: string
  cuepoints: Cuepoints[]
  playerRef: React.RefObject<MuxPlayerElement>
}) {
  const muxCuepoints = formateCuepoints(cuepoints)
  const [activeCuePoint, setActiveCuePoint] = useState<
    CuePointData | undefined
  >()
  return (
    <>
      <MuxPlayer
        ref={playerRef}
        loop={true}
        autoPlay={true}
        className="aspect-[16/9]"
        streamType="on-demand"
        playbackId={playbackId}
        thumbnailTime={playerRef.current?.currentTime}
        currentTime={playerRef.current?.currentTime}
        accent-color="#ea580c"
        // TODO: what is this for
        metadata={{
          video_id: 'video-id-54321',
          video_title: 'Test video title',
          viewer_user_id: 'user-id-007',
        }}
        onLoadedMetadata={({ target }) => {
          const playerEl = target as MuxPlayerElement
          playerEl.addCuePoints(muxCuepoints)
        }}
        onCuePointChange={({ detail }: { detail: CuePointData }) => {
          setActiveCuePoint(detail)
        }}
      />
      <div>
        {muxCuepoints.map((cuepoint) => (
          <div
            key={cuepoint.value.id}
            className={`${
              cuepoint.time === activeCuePoint?.time && 'bg-red-500'
            } cursor-pointer`}
            onClick={() => {
              if (playerRef.current) {
                playerRef.current.currentTime = cuepoint.time
                if (playerRef.current.paused) playerRef.current.play()
              }
            }}
          >
            <p>ID: {cuepoint?.value.id}</p>
            <p>Time: {cuepoint?.time}</p>
            <p>Description: {cuepoint?.value.description}</p>
            <p>Category: {cuepoint?.value.playCategory}</p>
          </div>
        ))}
      </div>
    </>
  )
}
