import { auth } from '@clerk/nextjs'
import { createInsertSchema } from 'drizzle-zod'

import { db } from '@/lib/db'
import { sessions } from '@/lib/db/schema'

export async function POST(req: Request): Promise<Response> {
  const { userId, orgId } = auth()
  console.log('inside api/create-session')
  if (!userId) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const rawBody = await req.text()
    const jsonBody = JSON.parse(rawBody)
    console.log('jsonBody: ', jsonBody)

    if (userId !== jsonBody.organiserId) {
      throw new Error('unauthorized')
    }

    if (orgId !== jsonBody.teamId) {
      throw new Error('unauthorized')
    }

    const insertSessionSchema = createInsertSchema(sessions)
    const session = insertSessionSchema.parse({
      session_name: jsonBody.name,
      session_description: jsonBody.description,
      teamId: jsonBody.teamId,
      organiserId: jsonBody.organiserId,
      session_start_date: new Date(jsonBody.session_start_date),
      session_end_date: new Date(jsonBody.session_start_date),
      location: jsonBody.location,
      sessionCategory: jsonBody.sessionCategory,
    })

    const insertedSession = await db
      .insert(sessions)
      .values(session)
      .returning({ sessionId: sessions.id, sessionName: sessions.session_name })

    return Response.json(
      {
        message: 'Success',
        sessionId: insertedSession[0].sessionId,
        sessionName: insertedSession[0].sessionName,
      },
      { status: 200 }
    )
  } catch (e) {
    console.error('Request error', e) // eslint-disable-line no-console
    return Response.json({ error: e }, { status: 500 })
  }
}
