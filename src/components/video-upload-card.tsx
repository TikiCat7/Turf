'use client'

import MuxPlayer from '@mux/mux-player-react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import React from 'react'

import { Badge } from '@/components/ui/badge'

export default function VideoUploadCard() {
  return (
    <div className="flex items-center flex-col mt-4">
      <motion.div
        className="flex items-center rounded-2xl p-4 shadow-2xl space-x-1 justify-center h-[40px] text-sm border mb-4 w-[300px]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{
          duration: 0.5,
          delay: 0.3,
        }}
      >
        <CheckCircle2
          size={24}
          className="text-turf-light dark:text-turf-dark"
        />
        <p className="font-semibold text-sm">
          Video from recent match is ready!
        </p>
      </motion.div>
      <motion.div
        className="flex lg:space-x-4 lg:flex-row flex-col space-x-0 items-center space-y-8 lg:space-y-0"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{
          duration: 0.8,
          delay: 1,
        }}
      >
        {/* <video src="/header-goal.mp4" autoPlay muted loop /> */}
        <div className="flex flex-col">
          <MuxPlayer
            className="overflow-hidden rounded-md aspect-[16/9] lg:w-[300px]"
            accent-color="#44997F"
            muted
            loop
            autoPlay
            src={
              'https://stream.mux.com/9erbIlXzbj99w3g19Eqm7zVyv6jfjSM00Cj01IyM5CM6U.m3u8'
            }
          />
          <div className="pt-1">
            <Badge>Highlight</Badge>
            <p className="">First half highlight vs Atlas FC</p>
          </div>
        </div>
        <div className="flex flex-col">
          <MuxPlayer
            className="overflow-hidden rounded-md aspect-[16/9] lg:w-[300px]"
            accent-color="#44997F"
            muted
            loop
            autoPlay
            src={
              'https://stream.mux.com/02Mbgyp6OwVPZFNOWLlGdBFNjubSHTiuSptJvZbaMvgU.m3u8'
            }
          />
          <div className="pt-1">
            <Badge>Shot</Badge>
            <p className="">Long shot attempt</p>
          </div>
        </div>
        <div className="flex flex-col">
          <MuxPlayer
            className="overflow-hidden rounded-md aspect-[16/9] lg:w-[300px]"
            streamType="on-demand"
            accent-color="#44997F"
            muted
            loop
            autoPlay
            src={
              'https://stream.mux.com/3gAR4wwO0201UdlI4cg8BS51rz1jNPX2hWwaB8M00R7rNo.m3u8'
            }
          />
          <div className="pt-1">
            <Badge>Goal</Badge>
            <p className="">Goal vs Uchiha FC</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
