'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      <Link
        href="/team"
        className={cn(
          pathname === '/team' ? 'text-primary' : 'text-muted-foreground',
          'text-sm font-medium transition-colors hover:text-primary'
        )}
      >
        Team
      </Link>
      <Link
        href="/uploads"
        className={cn(
          pathname === '/uploads' ? 'text-primary' : 'text-muted-foreground',
          'text-sm font-medium transition-colors hover:text-primary'
        )}
      >
        Upload
      </Link>
      <Link
        href="/assets"
        className={cn(
          pathname === '/assets' ? 'text-primary' : 'text-muted-foreground',
          'text-sm font-medium transition-colors hover:text-primary'
        )}
      >
        Gallery
      </Link>
    </nav>
  )
}
