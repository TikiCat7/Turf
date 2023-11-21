'use client'

import { SignIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import Image from 'next/image'
import { useTheme } from 'next-themes'

import Globe from '@/components/magicui/globe'

// test clerk prod

export default function Page() {
  const { theme } = useTheme()
  return (
    <div className="container flex flex-row items-center justify-center h-screen lg:max-w-none">
      <div className="flex-1 flex-col hidden lg:flex">
        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 text-center bg-clip-text text-7xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10 pb-2">
          A better way to manage grassroots football.
        </span>
        <span className="relative">
          <Globe className="w-[500px]" />
        </span>
        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
      </div>
      <div className="flex absolute bottom-8 items-center">
        <Image
          alt="turf logo"
          src="/logo-no-background.png"
          width={100}
          height={200}
        />
        <p className="text-muted-foreground mt-4 text-xs">(Private Alpha)</p>
      </div>

      <div className="items-center justify-center flex h-full flex-1">
        <SignIn
          afterSignInUrl={'/'}
          appearance={{
            baseTheme: theme === 'dark' ? dark : undefined,
          }}
        />
      </div>
    </div>
  )
}
