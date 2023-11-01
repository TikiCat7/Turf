'use client'

import MuxPlayer from '@mux/mux-player-react'
import { useState } from 'react'

export default function VideoPlayer({ playbackId }: { playbackId: string }) {
  const [currentTime] = useState(0)

  return (
    <>
      <MuxPlayer
        streamType="on-demand"
        playbackId={playbackId}
        // TODO: what is this for
        metadata={{
          video_id: 'video-id-54321',
          video_title: 'Test video title',
          viewer_user_id: 'user-id-007',
        }}
        currentTime={currentTime}
      />
    </>
  )
}
