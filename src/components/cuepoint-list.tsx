import type MuxPlayerElement from '@mux/mux-player'
import { RefObject } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MuxCuePointData } from '@/components/video-section'
import { cn } from '@/lib/utils'

export default function CuepointList({
  cuepoints,
  activeCuePoint,
  playerRef,
}: {
  cuepoints: MuxCuePointData[]
  activeCuePoint: MuxCuePointData | undefined
  playerRef: RefObject<MuxPlayerElement>
}) {
  const setActive = (cuepoint: MuxCuePointData) => {
    if (playerRef.current) {
      playerRef.current.currentTime = cuepoint.time
      if (playerRef.current.paused) playerRef.current.play()
    }
  }

  return (
    <Card className="flex items-center justify-center flex-col">
      <CardHeader className="w-full items-start pb-2">
        <CardTitle>Video Events</CardTitle>
        <CardDescription>
          Notable events that occured in the video.
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full px-6">
        {cuepoints.length === 0 ? (
          <p className="text-xs text-muted-foreground">0 events tagged</p>
        ) : (
          <ScrollArea className="h-36 lg:h-72 rounded-md w-full flex flex-col">
            {cuepoints.map((cuepoint, i) => {
              const isActive = cuepoint.time === activeCuePoint?.time
              // TODO: Scroll to active cuepoint
              // if (i > 0) {
              //   document
              //     .getElementById(`item_${i}`)
              //     ?.scrollIntoView({ behavior: 'smooth' })
              // }
              return (
                <div
                  className={cn(
                    'justify-between flex flex-col p-2 rounded-md cursor-pointer',
                    isActive && 'bg-secondary'
                  )}
                  key={i}
                  id={`item_${i}`}
                  onClick={() => setActive(cuepoint)}
                >
                  <div className="flex items-center space-x-2 px-2">
                    <p className="text-base">{cuepoint.value.playCategory}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-secondary-foreground cursor-pointer">
                        {new Date(cuepoint.time * 1000)
                          .toISOString()
                          .slice(14, 22)}
                      </span>{' '}
                      by{' '}
                      <span className="font-bold text-blue-500 cursor-pointer">
                        @Joe
                      </span>
                    </p>
                  </div>
                </div>
              )
            })}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
