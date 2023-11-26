'use server'

import * as nextjs from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import { revalidatePath } from 'next/cache'

import { db } from '@/lib/db'
import { cuepoints, users } from '@/lib/db/schema'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addCuepoint(_: any, formData: FormData) {
  console.log('inside addCuepoint action')
  console.log('formData: ', formData)
  try {
    const clerkUser = nextjs.auth()
    const user = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUser.userId!))
    console.log('found the user in our DB: ', user[0])
    if (!user || !user[0]) {
      console.log('corresponding user not found!')
      throw new Error('corresponding user not found!')
    }
    console.log('found a user, adding cuepoint to DB')

    const insertCuepointSchema = createInsertSchema(cuepoints)
    const cuepoint = insertCuepointSchema.parse({
      videoId: formData.get('videoId'),
      taggerId: user[0].id,
      playCategory: formData.get('playCategory'),
      description: formData.get('description'),
      time: parseFloat(formData.get('time')?.toString() ?? '0'),
      // teamMember: formData.get('playerId'),
    })
    console.log('adding cuepoint data to db: ', cuepoint)
    await db.insert(cuepoints).values(cuepoint)
    revalidatePath('/')

    return {
      message: `Added cuepoint type: ${cuepoint.playCategory} at ${cuepoint.time} seconds.`,
      cuepoint: cuepoint,
      success: true,
    }
  } catch (e) {
    console.log('Something went wrong adding a cuepoint!', e)
    return { message: 'Failed to add cuepoint', cuepoint: null, success: false }
  }
}
