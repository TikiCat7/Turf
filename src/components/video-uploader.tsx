import React from 'react'

interface VideoUploaderProps {
  onVideoSelect: (file: File) => void
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoSelect }) => {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      onVideoSelect(file)
    }
  }

  return <input type="file" accept="video/*" onChange={handleFileSelect} />
}

export default VideoUploader
