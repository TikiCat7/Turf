'use client'

import { useState } from 'react'

import VideoUploader from './video-uploader'
import VideoViewer from './video-viewer'

const VideoSection = () => {
  const [selectedVideo, setSelectedVideo] = useState<null | File>(null)

  const handleVideoSelect = (file: File) => {
    setSelectedVideo(file)
  }
  return (
    <div className="flex-col w-full space-y-8">
      <VideoUploader onVideoSelect={handleVideoSelect} />
      <VideoViewer selectedVideo={selectedVideo} />
    </div>
  )
}

export default VideoSection
