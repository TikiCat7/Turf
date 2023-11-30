'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'

import Marquee from './magicui/marquee'
import NumberTicker from './magicui/number-ticker'

const teams = [
  {
    name: 'Big Poppas',
    username: '@BigPoppas_FC',
    body: 'Big Poppas is an amateur team in Singapore.',
    img: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJZVE80NlFMY2ZBcENDT1JEcWg5aFRHSEZSZyJ9',
  },
  {
    name: 'Lads on Toure',
    username: '@LadsOnToure_FC',
    body: 'Lads On Toure is an amateur team in Singapore.',
    img: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJZVGFGOXZ2dWxHNEI0YjkyVnN6WnZGcVRYQyJ9',
  },
  {
    name: 'FootballCom',
    username: '@FootballCom',
    body: 'FootballCom is a recreational group that plays in Singapore.',
    img: 'https://avatar.vercel.sh/john',
  },
  {
    name: 'Team A',
    username: '@TeamA_FC',
    body: 'TeamA is an amateur team in Singapore.',
    img: 'https://avatar.vercel.sh/jane',
  },
  {
    name: 'Team B',
    username: '@TeamB_FC',
    body: 'Team B is an amateur team in Singapore.',
    img: 'https://avatar.vercel.sh/jenny',
  },
]

const TeamCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <figure
      className={
        'relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4 border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]'
      }
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  )
}

export default function SocialContent() {
  return (
    <motion.div
      className="relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-lg py-8 lg:mt-[50px] lg:max-w-6xl w-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center flex-col md:flex-row">
        <div className="flex items-center">
          <NumberTicker
            value={5}
            delay={1}
            className="text-xl lg:text-4xl font-bold text-turf-light dark:text-turf-dark"
          />
          <h1 className="text-xl lg:text-4xl font-bold px-2 py-4 text-turf-light dark:text-turf-dark">
            Teams using
          </h1>
        </div>
        <Image
          alt="turf logo"
          src="/logo-no-background.png"
          className="w-[70px] lg:w-[100px]"
          width={100}
          height={60}
          priority
        />
      </div>

      <Marquee pauseOnHover className="[--duration:30s]">
        {teams.map((team) => (
          <TeamCard key={team.username} {...team} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </motion.div>
  )
}
