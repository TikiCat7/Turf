'use server'

import * as nextjs from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { db } from '@/lib/db'
import { cuepoints, users } from '@/lib/db/schema'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function deleteCuepoint(_: any, formData: FormData) {
  console.log('delete addCuepoint action')
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

    const schema = z.object({
      id: z.string().min(1),
    })
    const cuepoint = schema.parse({
      id: formData.get('id'),
    })

    await db.delete(cuepoints).where(eq(cuepoints.id, cuepoint.id))
    revalidatePath('/')

    return {
      message: `Delete cuepoint type: ${formData.get('id')} at ${formData.get(
        'time'
      )} seconds.`,
    }
  } catch (e) {
    console.log('Something went wrong deleting cuepoint!', e)
    return { message: 'Failed to delete cuepoint' }
  }
}
