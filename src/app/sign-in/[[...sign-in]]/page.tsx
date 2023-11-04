'use client'

import { SignIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useTheme } from 'next-themes'

import Globe from '@/components/magicui/globe'

export default function Page() {
  const { theme } = useTheme()
  return (
    <div className="container flex flex-row items-center justify-center h-screen lg:max-w-none">
      <div className="flex-1 flex-col hidden lg:flex">
        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 text-center bg-clip-text text-7xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10 pb-2">
          Video for football communities.
        </span>
        <span className="relative">
          <Globe className="w-[500px]" />
        </span>
        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
      </div>
      <div className="flex absolute bottom-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-6 w-6"
        >
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
        Turf Inc.
      </div>

      <div className="items-center justify-center flex h-full flex-1">
        <SignIn
          afterSignInUrl={'/'}
          appearance={{
            baseTheme: theme === 'dark' ? dark : undefined,
            elements: {
              formButtonPrimary:
                'bg-primary hover:bg-primary/50 text-sm normal-case',
            },
          }}
        />
      </div>
    </div>
  )
}
