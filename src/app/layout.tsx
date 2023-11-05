import { ClerkProvider, currentUser } from '@clerk/nextjs'
import type { Metadata } from 'next'

import './globals.css'
import { MainNav } from '@/components/main-nav'
import TeamSelection from '@/components/team-selection'
import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from '@/components/theme-toggle'
import { UserNav } from '@/components/user-nav'
import { cn } from '@/lib/utils'

import { fontSans } from './fontSans'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
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
            <main className="flex min-h-screen flex-col items-center w-full">
              {user && (
                <div className="hidden flex-col md:flex w-full">
                  <div className="border-b">
                    <div className="flex h-16 items-center px-[10%]">
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
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
