'use client'

import { motion } from 'framer-motion'
import React from 'react'

export default function HeaderRightContent() {
  return (
    <motion.div
      className="items-center flex flex-col w-full relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div className="rounded-2xl overflow-hidden max-w-[650px] shadow-2xl">
        <video src="/header-goal.mp4" autoPlay muted loop />
      </motion.div>
      <motion.div
        className="text-center flex items-center space-x-1 justify-center"
        initial={{ opacity: 0, y: 0, position: 'absolute', bottom: 0 }}
        animate={{
          opacity: [0, 1, 1, 0],
          y: [0, -20, -20, 0],
          position: 'absolute',
          bottom: 0,
        }}
        transition={{
          duration: 2.5,
          ease: 'easeInOut',
          delay: 6,
          repeatDelay: 8,
          repeat: Infinity,
        }}
      >
        <div className="rounded-2xl p-2 flex space-x-1 bg-card shadow-xl">
          <p className="text-muted-foreground">@Joe</p>
          <p>What a goal🔥</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
