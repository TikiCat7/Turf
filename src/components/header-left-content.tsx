'use client'

import { motion } from 'framer-motion'
import React from 'react'

export default function HeaderLeftContent() {
  return (
    <motion.div
      className="flex flex-col max-w-[500px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-turf-light dark:text-turf-dark font-bold text-3xl lg:text-5xl ">
        A better way to manage grassroots sports.
      </p>
      <p className="text-muted-foreground lg:text-2xl font-medium mt-5">
        Turf is a better way to manage your grassroots sports team. From
        scheduling and payments, to watching videos, Turf handles everything -
        so you can focus on the game.
      </p>
      <div className="flex text-xl font-bold text-white rounded-full cursor-pointer p-2 text-center items-center justify-start mt-4">
        <p className="bg-[#006E59] p-4 rounded-full">Join the Waitlist</p>
      </div>
    </motion.div>
  )
}
