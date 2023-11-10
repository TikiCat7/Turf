'use client'
import { useEffect } from 'react'
import {
  // @ts-expect-error help
  experimental_useFormState as useFormState,
  // @ts-expect-error help
  experimental_useFormStatus as useFormStatus,
} from 'react-dom'

import sendInvite from '@/app/actions/send-invite'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { useToast } from './ui/use-toast'

const initialState = {
  success: null,
}

export default function InviteForm() {
  const [state, formAction] = useFormState(sendInvite, initialState)
  const { toast } = useToast()
  const { pending } = useFormStatus()

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Invite sent!',
        description: 'Your invite has been sent successfully',
      })
    } else if (state.success === false) {
      toast({
        title: 'Invite failed!',
        description: 'Your invite failed to send',
      })
    }
  }, [state])

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-6 items-center gap-2">
        <Input
          type="email"
          placeholder="email"
          name="email"
          required
          className="col-span-6 xs:col-span-4"
        />
        <Select defaultValue="basic_member" required name="type">
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic_member">Member</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button aria-disabled={pending} type="submit">
        {pending ? 'Sending...' : 'Send Invite'}
      </Button>
    </form>
  )
}
