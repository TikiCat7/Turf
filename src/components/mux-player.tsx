'use client'

import MuxPlayer from '@mux/mux-player-react'

export default function Player({ playbackId }: { playbackId: string }) {
  return (
    <MuxPlayer
      streamType="on-demand"
      playbackId={playbackId}
      metadata={{
        video_id: 'video-id-54321',
        video_title: 'Test video title',
        viewer_user_id: 'user-id-007',
      }}
    />
  )
}
