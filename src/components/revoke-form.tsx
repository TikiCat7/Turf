'use client'
import { useEffect } from 'react'
import {
  // @ts-expect-error help
  experimental_useFormState as useFormState,
  // @ts-expect-error help
  experimental_useFormStatus as useFormStatus,
} from 'react-dom'

import revokeInvite from '@/app/actions/revoke-invite'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

const initialState = {
  success: null,
}

export default function RevokeForm({
  id,
  email,
  role,
  orgId,
  createdAt,
  requestingUserId,
}: {
  id: string
  email: string
  role: string
  orgId: string
  createdAt: number
  requestingUserId: string
}) {
  const [state, formAction] = useFormState(revokeInvite, initialState)
  const { toast } = useToast()
  const { pending } = useFormStatus()

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Cancelled invitation.',
        description: 'Your invite has been cancelled.',
      })
    } else if (state.success === false) {
      toast({
        title: 'Cancel failed!',
        description: 'Your cancellation failed.',
      })
    }
  }, [state])

  return (
    <div className="flex items-start flex-col" key={id}>
      <Badge className="text-xs md:text-sm mb-2" variant={'outline'}>
        {role === 'basic_member' ? 'Member' : 'Admin'}
      </Badge>

      <div className="flex md:space-x-1 items-start md:items-center flex-col sm:flex-row">
        <div className="text-xs md:text-sm">{email}</div>
        <div className="text-xs md:text-sm">
          {new Date(createdAt).toLocaleDateString()}
        </div>
        <form action={formAction}>
          <input type="hidden" name="invitationId" value={id} />
          <input type="hidden" name="organizationId" value={orgId} />
          <input
            type="hidden"
            name="requestingUserId"
            value={requestingUserId}
          />
          <Button
            type="submit"
            size="sm"
            variant={'secondary'}
            aria-disabled={pending}
            className="mt-2 md:mt-0 md:ml-2"
          >
            Cancel
          </Button>
        </form>
      </div>
    </div>
  )
}
