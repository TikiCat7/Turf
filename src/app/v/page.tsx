'use client'

import MuxPlayer from '@mux/mux-player-react'

export default function VideoPlayer() {
  return (
    <MuxPlayer
      className="aspect-[9/16] max-w-[350px]"
      preload="none"
      playbackId="1EFcsL5JET00t00mBv01t00xt00T4QeNQtsXx2cKY6DLd7RM"
      streamType="on-demand"
    />
  )
}
