'use client'

import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu'

export default function SignoutButton() {
  const { signOut } = useClerk()
  const router = useRouter()
  return (
    <DropdownMenuItem onClick={() => signOut(() => router.push('/'))}>
      Sign out
      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  )
}
