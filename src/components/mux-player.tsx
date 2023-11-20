'use client'

import type MuxPlayerElement from '@mux/mux-player'
import MuxPlayer from '@mux/mux-player-react'
import { DownloadIcon } from 'lucide-react'
import { useState } from 'react'

import CuepointList from '@/components/cuepoint-list'
import CuepointTag from '@/components/cuepoint-tag'
// import DeleteCuepoint from '@/components/delete-cuepoint'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MuxCuePointData } from '@/components/video-section'
import { SelectUsers } from '@/lib/db/schema'
import { cn } from '@/lib/utils'

import { Button } from './ui/button'
// import { cuepoints } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

export default function VideoPlayer({
  playbackId,
  videoId,
  muxCuepoints,
  playerRef,
  duration,
  teamMembers,
}: {
  playbackId: string
  videoId: string
  muxCuepoints: MuxCuePointData[]
  playerRef: React.RefObject<MuxPlayerElement>
  duration: number
  teamMembers: { user: SelectUsers; userId: string; teamId: string }[]
}) {
  const [activeCuePoint, setActiveCuePoint] = useState<
    MuxCuePointData | undefined
  >()

  const [renderTimeline, setRenderTimeline] = useState(false)

  return (
    <div className="grid grid-cols-10 gap-4">
      <div className="lg:col-span-7 col-span-10">
        <MuxPlayer
          ref={playerRef}
          className="aspect-[16/9] w-full"
          streamType="on-demand"
          playbackId={playbackId}
          currentTime={playerRef.current?.currentTime}
          accent-color="#44997F"
          // TODO: what is this for
          metadata={{
            video_id: 'video-id-54321',
            video_title: 'Test video title',
            viewer_user_id: 'user-id-007',
          }}
          onLoadedMetadata={({ target }) => {
            const playerEl = target as MuxPlayerElement
            playerEl.addCuePoints(muxCuepoints)
            setRenderTimeline(true)
          }}
          onCuePointChange={({ detail }: { detail: MuxCuePointData }) => {
            setActiveCuePoint(detail)
          }}
        />
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setRenderTimeline(!renderTimeline)}
          >
            Timeline
          </Button>
          <Button variant="outline">
            <DownloadIcon className="h-4 w-4" />
          </Button>
        </div>
        {renderTimeline && (
          <div className="w-full bg-white/30 h-3 flex items-center justify-start bottom-[110px] relative">
            {muxCuepoints.map((cuepoint) => {
              const left = (cuepoint.time / duration) * 100
              const isActive = cuepoint.time === activeCuePoint?.time
              return (
                <div
                  key={cuepoint.value.id}
                  className="relative left-0"
                  style={{
                    color: 'bg-slate-900/10',
                    left: `calc(${left}% - 5px)`,
                  }}
                >
                  <div
                    className={`${
                      cuepoint.time === activeCuePoint?.time && ''
                    } cursor-pointer`}
                    onClick={() => {
                      if (playerRef.current) {
                        playerRef.current.currentTime = cuepoint.time
                        if (playerRef.current.paused) playerRef.current.play()
                      }
                    }}
                  >
                    <div
                      className={cn(
                        'bg-black/50 w-2 h-2 rounded',
                        isActive && 'bg-black'
                      )}
                    />
                    <div
                      className={cn(
                        'hover:opacity-100 opacity-0 left-[-65px] bottom-[12px] absolute flex transition-all duration-200 w-[130px] h-[50px] bg-slate-900/40 rounded-md translate-y-0 hover:translate-y-[-8px] flex-col items-center justify-center',
                        isActive && 'opacity-100 translate-y-[-8px]'
                      )}
                    >
                      <p className="font-bold text-white">
                        {cuepoint.value.playCategory}
                      </p>
                      <p className="text-white font-xs">
                        {new Date(cuepoint.time * 1000)
                          .toISOString()
                          .slice(14, 22)}
                      </p>
                    </div>
                  </div>
                  {/* <DeleteCuepoint id={cuepoint.value.id} /> */}
                </div>
              )
            })}
          </div>
        )}
      </div>
      <div className="col-span-10 lg:col-span-3">
        <Tabs defaultValue="events">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="events">
              {muxCuepoints.length} Events
            </TabsTrigger>
            <TabsTrigger value="tag">Tag Events</TabsTrigger>
          </TabsList>
          <TabsContent value="events">
            <CuepointList
              cuepoints={muxCuepoints}
              activeCuePoint={activeCuePoint}
              playerRef={playerRef}
            />
          </TabsContent>
          <TabsContent value="tag">
            <CuepointTag
              playerRef={playerRef}
              videoId={videoId}
              teamMembers={teamMembers}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
