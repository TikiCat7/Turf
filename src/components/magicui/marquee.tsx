import { Children, cloneElement } from 'react'

import { cn } from '@/lib/utils'

interface MarqueeProps {
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  children?: React.ReactNode
  [key: string]: any
}

const Marquee = ({
  className,
  reverse,
  pauseOnHover = false,
  children,
  ...props
}: MarqueeProps) => {
  return (
    <div
      {...props}
      className={cn(
        'flex w-full overflow-hidden [--duration:40s] [--gap:1rem]',
        className
      )}
    >
      <div
        className={cn(
          'flex w-max transform-gpu animate-marquee items-stretch gap-[--gap]',
          {
            '[animation-direction:reverse]': reverse,
            'hover:[animation-play-state:paused]': pauseOnHover,
          }
        )}
      >
        {Children.map(children, (child) => cloneElement(child as any))}
        {Children.map(children, (child) => cloneElement(child as any))}
        {Children.map(children, (child) => cloneElement(child as any))}
      </div>
    </div>
  )
}

export default Marquee
