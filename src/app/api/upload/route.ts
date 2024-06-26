import { auth } from '@clerk/nextjs'
import Mux from '@mux/mux-node'
import { eq } from 'drizzle-orm'

import { db } from '@/lib/db'
import { teams, uploads, users } from '@/lib/db/schema'

const { Video } = new Mux()

// TODO: handle the scenario that upload succeeds but saving the upload record fails
export async function POST(req: Request): Promise<Response> {
  const { userId, orgId } = auth()
  console.log('inside api/upload')
  console.log('userId', userId)
  if (!userId) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }
  try {
    const user = await db.select().from(users).where(eq(users.clerkId, userId))
    console.log('found the user in our DB: ', user[0])
    if (!user) {
      console.log('no matching user found!')
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    // Should users be able to upload footage without selecting a team?
    console.log('orgId on clerk side', orgId)
    if (!orgId) {
      console.log("user doesn't have any organization associated!")
      return Response.json(
        { error: 'User does not belong to any organisation on clerk side.' },
        { status: 404 }
      )
    }

    const org = await db.select().from(teams).where(eq(teams.clerkId, orgId))

    if (!org) {
      return Response.json(
        {
          error:
            'this user does not belong to a team yet, please create a team before uploading',
        },
        { status: 401 }
      )
    }
    console.log(
      'found the org for the current signed in user in our DB: ',
      org[0]
    )

    const rawBody = await req.text()
    const jsonBody = JSON.parse(rawBody)

    const upload = await Video.Uploads.create({
      test: jsonBody.isTestMode,
      new_asset_settings: {
        playback_policy: 'public',
        encoding_tier: jsonBody.encodingTier,
      },
      cors_origin: '*',
    })

    console.log('upload obj: ', upload)
    // save a record in Upload table to keep track of user / team
    const upload_id = await db
      .insert(uploads)
      .values({
        userId: user[0].id,
        teamId: org[0].id,
        uploadId: upload.id,
        uploadUrl: upload.url,
        clerkUserId: user[0].clerkId,
        clerkTeamId: org[0].clerkId,
        videoName: jsonBody.name,
        videoDescription: jsonBody.description,
        videoLocation: jsonBody.location,
        videoDate: new Date(jsonBody.date),
        videoTypeEnum: jsonBody.type,
      })
      .returning({
        insertedId: uploads.id,
      })
    console.log('upload record stored in DB: ', upload_id)

    return Response.json(
      {
        id: upload.id,
        url: upload.url,
        upload_id: upload_id,
        name: jsonBody.name,
      },
      { status: 200 }
    )
  } catch (e) {
    console.error('Request error', e) // eslint-disable-line no-console
    return Response.json({ error: e, statusCode: 500 })
  }
}
