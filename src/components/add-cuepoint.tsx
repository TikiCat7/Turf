'use client'

import {
  // @ts-expect-error help
  experimental_useFormState as useFormState,
  // @ts-expect-error help
  experimental_useFormStatus as useFormStatus,
} from 'react-dom'

import { addCuepoint } from '@/app/actions/insert-cuepoint'
import { Button } from '@/components/ui/button'

const initialState = {
  message: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" aria-disabled={pending}>
      Add Cuepoint
    </Button>
  )
}

export default function AddCuepoint({ videoId }: { videoId: string }) {
  const [state, formAction] = useFormState(addCuepoint, initialState)
  return (
    <form className="py-4" action={formAction}>
      <div className="flex flex-col space-y-2 max-w-md">
        <label htmlFor="description">Description</label>
        <input type="text" id="description" name="description" required />
        <label htmlFor="playCategory">Category</label>
        <input type="text" id="playCategory" name="playCategory" required />
        <label htmlFor="time">Time</label>
        <input type="decimal" id="time" name="time" required />
        <input
          type="text"
          id="videoId"
          name="videoId"
          required
          hidden
          readOnly
          value={videoId}
        />
      </div>
      <SubmitButton />
      <p aria-live="polite" className="text-primary" role="status">
        message: {state?.message}
      </p>
    </form>
  )
}
