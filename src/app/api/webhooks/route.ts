import Mux from '@mux/mux-node'
import { eq } from 'drizzle-orm'

import { db } from '@/lib/db'
import { uploads, videos } from '@/lib/db/schema'

const webhookSignatureSecret = process.env.MUX_WEBHOOK_SIGNATURE_SECRET

const verifyWebhookSignature = (rawBody: string | Buffer, req: Request) => {
  if (webhookSignatureSecret) {
    Mux.Webhooks.verifyHeader(
      rawBody,
      req.headers.get('mux-signature') as string,
      webhookSignatureSecret
    )
  } else {
    console.log(
      'Skipping webhook sig verification because no secret is configured'
    )
  }
  return true
}

export async function POST(req: Request): Promise<Response> {
  const rawBody = await req.text()
  try {
    verifyWebhookSignature(rawBody, req)
  } catch (e) {
    console.error(
      'Error verifyWebhookSignature - is the correct signature secret set?',
      e
    )
    return Response.json({ message: e }, { status: 400 })
  }

  const jsonBody = JSON.parse(rawBody)
  const { data, type, object } = jsonBody

  console.log('webhook type: ', type)
  // upload completed but video playback is not ready
  if (type === 'video.upload.asset_created') {
    // TODO: need more granular error handling here,
    // TODO: what happens if updating the upload succeeds, but saving the video record fails?
    try {
      const upload = await db
        .update(uploads)
        .set({ uploadStatus: 'ready' })
        .where(eq(uploads.uploadId, object.id))
        .returning({
          userId: uploads.userId,
          teamId: uploads.teamId,
          clerkUserId: uploads.clerkUserId,
          clerkTeamId: uploads.clerkTeamId,
        })

      await db.insert(videos).values({
        uploadId: object.id,
        videoUrl: '',
        videoName: 'test',
        videoStatus: 'preparing',
        teamId: upload[0].teamId,
        assetId: data.asset_id,
        userId: upload[0].userId,
        clerkUserId: upload[0].clerkUserId,
        clerkTeamId: upload[0].clerkTeamId,
      })
    } catch (e) {
      console.log(
        'something went wrong in the video.upload.asset_created callback',
        e
      )
      return Response.json({ message: e }, { status: 400 })
    }
    // video playback is now ready
  } else if (type === 'video.asset.ready') {
    try {
      await db
        .update(videos)
        // TODO: store more info like duration, resolution, frame rate, aspect ratio
        .set({
          videoStatus: 'ready',
          playbackUrl: data.playback_ids[0].id,
          duration: data.duration,
        })
        .where(eq(videos.assetId, object.id))

      // TODO: Send relevant notifications to user that video is ready
    } catch (e) {
      console.log(
        'something went wrong in the video.upload.asset_ready callback',
        e
      )
      return Response.json({ message: e }, { status: 400 })
    }
  } else if (type === 'video.asset.deleted') {
    try {
      await db.delete(videos).where(eq(data.id, videos.assetId))
    } catch (e) {
      console.log('something went wrong in the video.asset.delete callback', e)
      return Response.json({ message: e }, { status: 400 })
    }
  }

  return Response.json(
    { message: 'webhook handled successfully' },
    { status: 200 }
  )
}
