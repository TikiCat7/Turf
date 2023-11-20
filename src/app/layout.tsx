import { ClerkProvider, currentUser } from '@clerk/nextjs'
import type { Metadata } from 'next'
import Image from 'next/image'

import './globals.css'
import { MainNav } from '@/components/main-nav'
import TeamSelection from '@/components/team-selection'
import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from '@/components/theme-toggle'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { UserNav } from '@/components/user-nav'
import { cn } from '@/lib/utils'

import { fontSans } from './fontSans'

export const metadata: Metadata = {
  title: 'turf',
  description: 'turf is a better way to manage grass roots football teams.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()

  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased flex items-center justify-center w-full',
            fontSans.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <Toaster />
              <main className="flex min-h-screen flex-col items-center w-full">
                {user && (
                  <div className="flex-col md:flex w-full">
                    <div className="border-b">
                      <div className="flex h-16 items-center px-[10%]">
                        <Image
                          className="mr-4"
                          alt="turf app logo"
                          src="/logo-no-background.png"
                          width={75}
                          height={30}
                        />
                        <TeamSelection />
                        <MainNav className="mx-6" />
                        <div className="ml-auto flex items-center space-x-4">
                          <ModeToggle />
                          <UserNav />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {children}
              </main>
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
