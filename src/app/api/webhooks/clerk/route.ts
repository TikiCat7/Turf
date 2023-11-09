import type { WebhookEvent } from '@clerk/clerk-sdk-node'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { Webhook } from 'svix'

import { db } from '@/lib/db'
import { teams, users, usersOnTeams } from '@/lib/db/schema'

const webhookSignatureSecret = process.env.CLERK_WEBHOOK_SIGNATURE_SECRET || ''

async function verifyClerkWebhookSignature(request: Request) {
  const payloadString = await request.text()
  const headerPayload = headers()

  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    throw new Error('Error occured -- no svix headers')
  }

  const svixHeaders = {
    'svix-id': svix_id,
    'svix-timestamp': svix_timestamp,
    'svix-signature': svix_signature,
  }
  const wh = new Webhook(webhookSignatureSecret)
  return wh.verify(payloadString, svixHeaders) as WebhookEvent
}

export async function POST(req: Request): Promise<Response> {
  try {
    const payload = await verifyClerkWebhookSignature(req)
    const { type, data } = payload
    console.log('webhook type: ', type)

    switch (type) {
      case 'organizationMembership.created':
        console.log('user joined a team!')
        await db.insert(usersOnTeams).values({
          userId: data.public_user_data.user_id,
          teamId: data.organization.id,
        })
        break

      case 'organizationMembership.deleted':
        console.log('user left a team! ', data)
        await db
          .delete(usersOnTeams)
          // @ts-expect-error why is this type optional?
          .where(eq(data.public_user_data.user_id, usersOnTeams.userId))
        break

      case 'user.created':
        console.log('user created!', data)
        await db.insert(users).values({
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          avatarUrl: data.image_url,
        })
        break
      case 'user.updated':
        console.log('user updated!', data)
        break
      case 'user.deleted':
        console.log('user deleted!', data)
        if (data.deleted) {
          // @ts-expect-error why is this type optional?
          await db.delete(users).where(eq(data.id, users.clerkId))
        }
        break
      case 'organization.created':
        console.log('organization created!', data)
        await db.insert(teams).values({
          clerkId: data.id,
          name: data.name,
          slug: data.slug!,
        })
        break
      case 'organization.deleted':
        console.log('organization deleted!', data)
        // TODO: Delete the UsersOnTeams records first, then delete the team
        // @ts-expect-error why is this type optional?
        await db.delete(teams).where(eq(data.id, teams.clerkId))
        break
    }
  } catch (e) {
    console.error('Could not verify signature.', e)
    return Response.json({ message: e }, { status: 400 })
  }
  return Response.json({ message: 'ok, handled it' }, { status: 200 })
}
