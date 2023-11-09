'use server'

import { auth, clerkClient } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function sendInvite(_: any, formData: any) {
  const { orgId, userId } = auth()
  const org = clerkClient.organizations
  try {
    await org.createOrganizationInvitation({
      organizationId: orgId ?? '',
      emailAddress: formData.get('email'),
      role: formData.get('type'),
      inviterUserId: userId ?? '',
    })
    revalidatePath('/')
    return {
      success: true,
    }
  } catch (e) {
    console.log(e)
    return {
      success: false,
    }
  }
}
