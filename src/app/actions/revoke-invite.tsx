'use server'

import { clerkClient } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function revokeInvite(_: any, formData: any) {
  try {
    await clerkClient.organizations.revokeOrganizationInvitation({
      organizationId: formData.get('organizationId'),
      invitationId: formData.get('invitationId'),
      requestingUserId: formData.get('requestingUserId'),
    })
    revalidatePath('/')
    console.log('revoked invitation: ', formData.get('invitationId'))
    return {
      success: true,
    }
  } catch (e) {
    console.log(e)
    return { success: false }
  }
}
