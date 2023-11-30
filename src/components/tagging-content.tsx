'use client'

import { motion } from 'framer-motion'
import React from 'react'

export default function TaggingContent() {
  return (
    <motion.div
      className="px-10 mt-[50px] flex flex-col justify-center w-full max-w-6xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      viewport={{ once: true, margin: '-200px' }}
    >
      <h2 className="text-4xl font-bold text-turf-light dark:text-turf-dark">
        Tools for video analysis
      </h2>
      <p className="text-muted-foreground lg:text-xl font-medium py-2">
        Powerful tools to make video analysis a breeze. AI ✨ powered tagging
        coming soon.
      </p>
      <div className="flex items-center justify-center lg:p-8 flex-col lg:flex-md space-y-8">
        <div>
          <video
            src="/event-tag.mp4"
            muted
            autoPlay
            loop
            playsInline
            className="rounded-md overflow-hidden lg:max-w-[600px]"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Tag plays and players
          </p>
        </div>
        <div>
          <video
            src="/timeline.mp4"
            muted
            autoPlay
            loop
            playsInline
            className="rounded-md overflow-hidden lg:max-w-[600px]"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Timeline and event list for easy navigation
          </p>
        </div>
      </div>
    </motion.div>
  )
}
