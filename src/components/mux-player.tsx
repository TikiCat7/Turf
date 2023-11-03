'use client'

import type MuxPlayerElement from '@mux/mux-player'
import MuxPlayer from '@mux/mux-player-react'
import { useState } from 'react'

import DeleteCuepoint from '@/components/delete-cuepoint'
import { MuxCuePointData } from '@/components/video-section'

export const dynamic = 'force-dynamic'

export default function VideoPlayer({
  playbackId,
  muxCuepoints,
  playerRef,
}: {
  playbackId: string
  muxCuepoints: MuxCuePointData[]
  playerRef: React.RefObject<MuxPlayerElement>
}) {
  const [activeCuePoint, setActiveCuePoint] = useState<
    MuxCuePointData | undefined
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
          console.log(playerEl.cuePoints)
        }}
        onCuePointChange={({ detail }: { detail: MuxCuePointData }) => {
          console.log('cue point was changed!')
          console.log('detail: ', detail)
          setActiveCuePoint(detail)
        }}
      />
      {muxCuepoints.map((cuepoint) => (
        <div key={cuepoint.value.id}>
          <div
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
          <DeleteCuepoint id={cuepoint.value.id} />
        </div>
      ))}
    </>
  )
}
