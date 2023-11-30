'use client'

import { motion, useAnimate, useMotionValue, useTransform } from 'framer-motion'
import { AlertTriangle, CalendarDays, CheckCircle2, MapPin } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { Avatar, AvatarImage } from './ui/avatar'
import { CardContent, CardHeader } from './ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'

export default function HeaderContent() {
  const [attendingCount, setAttendingCount] = useState(13)
  const [show, setShow] = useState(false)
  const count = useMotionValue(attendingCount)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const [scope, animate] = useAnimate()

  useEffect(() => {
    const controls = animate(count, attendingCount, { duration: 1 })
    return controls.stop
  }, [attendingCount])

  return (
    <div className="flex justify-between p-10">
      <motion.div
        className="flex flex-col max-w-[650px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[#006E59] font-bold text-5xl ">
          Your sunday squad, now premier.
        </p>
        <p className="text-[#565A59] text-2xl font-medium max-w-[560px] mt-5">
          Turf is a better way to manage your grassroots sports team. From
          scheduling and payments, to watching videos, Turf handles everything -
          so you can focus on the game.
        </p>
        <div className="flex  text-xl font-bold text-white rounded-full cursor-pointer p-2 text-center items-center justify-center">
          <p className="bg-[#006E59] p-4 rounded-full">Join the Waitlist</p>
        </div>
      </motion.div>
      <div className="flex flex-col items-center space-y-4 relative top-[-100px] right-[100px]">
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="bg-white rounded-2xl w-[420px] shadow-2xl">
            <CardHeader className="text-2xl font-bold text-black px-6 py-4">
              <div className="flex items-center space-x-1">
                <CalendarDays size={20} />
                <p>Upcoming Session</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Avatar className="mr-1 h-5 w-5">
                  <AvatarImage src={'https://avatar.vercel.sh/personal.png'} />
                </Avatar>
                <p className="text-black text-xl font-medium">vs Big Poppas</p>
              </div>
              <div className="pt-2">
                <p className="text-[#7A7A7A] text-base font-medium">
                  Nov 21st, 19:00 pm
                </p>
                <div className="items-center flex space-x-1">
                  <MapPin className="text-[#7A7A7A]" width={15} height={15} />
                  <p className="text-[#7A7A7A] text-base font-medium">
                    Turf City Pitch 4
                  </p>
                </div>
              </div>
              <div className="mt-4 flex w-full justify-between items-center">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-1">
                    <motion.p className="text-sm font-medium text-[#7A7A7A] pb-1">
                      {rounded}
                    </motion.p>
                    <p className="text-sm font-medium text-[#7A7A7A] pb-1">
                      {' '}
                      attending
                    </p>
                    {show && (
                      <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{
                          opacity: [0, 1, 1, 1, 0],
                          y: [5, -2, -2, -2, -2],
                        }}
                        transition={{ duration: 1, delay: 0 }}
                      >
                        👍
                      </motion.p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Image
                      src={'/group-heads.png'}
                      alt="heads"
                      width={120}
                      height={20}
                    />
                    <motion.div
                      className=""
                      ref={scope}
                      initial={{ opacity: 0, x: 5, rotate: -45 }}
                    >
                      <Avatar className="mr-1 h-7 w-7">
                        <AvatarImage src={'/single-face.png'} />
                      </Avatar>
                    </motion.div>
                  </div>{' '}
                </div>
                <div>
                  <Select
                    onValueChange={(e) => {
                      if (e === 'attending') {
                        setAttendingCount(14)
                        animate(
                          scope.current,
                          { opacity: 1, x: -3, rotate: 0 },
                          { duration: 1.2, type: 'spring', bounce: 0.3 }
                        )
                        setShow(true)
                      } else {
                        setAttendingCount(13)
                        animate(
                          scope.current,
                          { opacity: 0, x: 5, rotate: -45 },
                          { duration: 0.6, type: 'spring', bounce: 0.3 }
                        )
                        setShow(false)
                      }
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Attendance</SelectLabel>
                        <SelectItem value="attending">Attending</SelectItem>
                        <SelectItem value="not-attending">
                          Not Attending
                        </SelectItem>
                        <SelectItem value="undecided">Undecided</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </div>
        </motion.div>
        <div className="flex items-center space-x-8">
          <motion.div
            className="mr-[50px] mb-[120px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="bg-white rounded-2xl w-[250px] p-4 py-8 shadow-2xl">
              <p className="text-xl font-bold">Match Fee Collection</p>
              <div className="flex items-center">
                <p className="text-[#334155] font-bold text-xl">$230</p>
                <p className="text-[#949494] text-xs mt-1 ml-1">(12/15)</p>
              </div>
              <div className="flex flex-col py-2 items-start">
                <div className="flex items-center space-x-1">
                  <p className="font-bold text-muted-foreground">Received</p>
                  <CheckCircle2 size={15} className="text-[#0DE6BF]" />
                </div>
                <Image src={'/heads.png'} alt="heads" width={80} height={20} />
              </div>
              <div className="flex flex-col py-2 items-start">
                <div className="items-center flex flex-col">
                  <p className="text-xs text-[#949494]">
                    Automatic reminder in 1 hour
                  </p>
                  <div className="flex items-center w-full space-x-1">
                    <p className="font-bold text-muted-foreground">Pending</p>
                    <AlertTriangle size={15} className="text-[#FF784E]" />
                  </div>
                </div>
                <Image
                  src={'/heads-small.png'}
                  alt="heads"
                  width={50}
                  height={10}
                />
              </div>
            </div>
          </motion.div>
          <div className="flex flex-col space-y-4 mt-[50px]">
            <motion.div
              className="flex items-center bg-white rounded-2xl p-4 shadow-2xl space-x-1 justify-center h-[40px] text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 1,
              }}
            >
              <CheckCircle2 size={24} className="text-[#0DE6BF]" />
              <p className="font-semibold text-sm">
                Video from recent match is ready!
              </p>
            </motion.div>
            <motion.div
              className="rounded-2xl w-[300px] overflow-hidden shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 1,
              }}
            >
              <video src="/header-goal.mp4" autoPlay muted loop />
            </motion.div>
            <motion.div
              className="text-center flex items-center space-x-1 justify-center"
              initial={{ opacity: 0, y: -50 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [-50, -70, -70, -50],
              }}
              transition={{
                duration: 2,
                delay: 6,
                repeatDelay: 8,
                repeat: Infinity,
              }}
            >
              <div className="bg-card rounded-xl p-2 flex space-x-1">
                <p className="text-muted-foreground">@Joe</p>
                <p>What a strike🔥</p>
              </div>
            </motion.div>
            <motion.div
              className="text-center flex items-center space-x-1 justify-center"
              initial={{ opacity: 0, y: -300 }}
              animate={{ opacity: [0, 1, 1, 0], y: [-300, -280, -280, -300] }}
              transition={{
                duration: 2,
                delay: 5,
                repeat: Infinity,
                repeatDelay: 8,
              }}
            >
              <div className="bg-card rounded-xl p-2 flex space-x-1">
                <p className="text-muted-foreground">@Joe</p>
                <p>OMG!!!😱😱😱</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
