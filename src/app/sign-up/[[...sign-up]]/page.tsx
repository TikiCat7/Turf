'use client'

import { SignUp } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useTheme } from 'next-themes'

export default function Page() {
  const theme = useTheme()
  const currentTheme = theme.theme === 'dark' ? dark : undefined
  return (
    <div className="flex items-center justify-center h-screen">
      <SignUp
        appearance={{
          baseTheme: currentTheme,
        }}
      />
    </div>
  )
}
