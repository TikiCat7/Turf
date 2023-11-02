'use client'

import {
  // @ts-expect-error help
  experimental_useFormState as useFormState,
  // @ts-expect-error help
  experimental_useFormStatus as useFormStatus,
} from 'react-dom'

import { deleteCuepoint } from '@/app/actions/delete-cuepoint'
import { Button } from '@/components/ui/button'

const initialState = {
  message: null,
}

function DeleteButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" aria-disabled={pending}>
      Delete Cuepoint
    </Button>
  )
}

export default function DeleteCuepoint({ id }: { id: string }) {
  const [state, formAction] = useFormState(deleteCuepoint, initialState)
  return (
    <form className="py-4" action={formAction}>
      <div className="flex flex-col space-y-2 max-w-md">
        <input
          type="text"
          id="id"
          name="id"
          required
          hidden
          readOnly
          value={id}
        />
      </div>
      <DeleteButton />
      <p aria-live="polite" className="text-primary" role="status">
        message: {state?.message}
      </p>
    </form>
  )
}
