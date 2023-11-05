'use client'

import { useOrganization, useUser } from '@clerk/nextjs'
import { UpChunk } from '@mux/upchunk'
import { redirect } from 'next/dist/client/components/redirect'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'

const Uploads = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadDone, setIsUploadingDone] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
  const [uploadId, setUploadId] = useState()
  const [errorMessage, setErrorMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const user = useUser()
  if (!user) {
    redirect('/sign-in')
  }

  const org = useOrganization()

  const [file, setFile] = useState<File>()

  const createUpload = async () => {
    try {
      console.log('inside create upload')
      const res = await fetch('/api/upload', { method: 'POST' })
      if (!res.ok) {
        console.log(await res.json())
        throw new Error('Error creating upload')
      }
      const { url, id } = await res.json()
      setUploadId(id)
      return url
    } catch (e) {
      console.error('Error in createUpload')
      setErrorMessage('Error creating upload')
    }
  }

  const prepareUpload = () => {
    setIsUploadingDone(false)
    const files = inputRef.current?.files
    if (!files) {
      setErrorMessage('No file selected.')
      return
    }
    setFile(files[0])
  }

  const startUpload = async () => {
    setIsUploading(true)
    console.log('starting upload')
    if (!file) {
      setErrorMessage('No file selected.')
      return
    }

    const upload = UpChunk.createUpload({
      endpoint: createUpload,
      file: file,
    })

    upload.on('error', (err: any) => {
      setIsUploading(false)
      setIsUploadingDone(false)
      setErrorMessage(err.detail.message)
    })

    upload.on('progress', (progress: any) => {
      setProgress(Math.floor(progress.detail))
    })

    upload.on('success', async () => {
      setIsUploading(false)
      setIsUploadingDone(true)
      console.log('success uploading, updating upload status')
    })
  }
  return (
    <div className="flex-col py-16 w-4/5 space-y-4">
      <p className="text-4xl font-bold text-primary">Upload Video</p>
      <p className="text-muted-foreground py-4">
        Uploading video to {org.organization?.name}. While uploading, please
        keep the page open!
      </p>

      {errorMessage && <p className="text-primary">{errorMessage}</p>}
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Input
          ref={inputRef}
          id="video"
          type="file"
          onChange={prepareUpload}
          disabled={isUploading}
        />
        {file && (
          <Button
            onClick={startUpload}
            disabled={isUploading}
            className="max-w-[100px]"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        )}
        {isUploading && <Progress className="my-2" value={progress} />}
        {isUploadDone && <p>Upload done!</p>}
        {isUploadDone && <p>{uploadId}</p>}
      </div>
    </div>
  )
}

export default Uploads
