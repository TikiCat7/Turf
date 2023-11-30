'use client'
import { motion, useAnimate, useMotionValue, useTransform } from 'framer-motion'
import { CalendarDays, MapPin } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import { Avatar, AvatarImage } from './ui/avatar'
import { Card, CardContent, CardHeader } from './ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'

export default function ScheduleCard() {
  const [attendingCount, setAttendingCount] = useState(13)
  const [show, setShow] = useState(false)
  const count = useMotionValue(attendingCount)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const [scope, animate] = useAnimate()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const controls = animate(count, attendingCount, { duration: 1 })
    return controls.stop
  }, [attendingCount])

  return (
    <motion.div
      className="bg-card flex items-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      viewport={{ once: true }}
    >
      <Card className="rounded-2xl max-w-[420px] shadow-2xl">
        <CardHeader className="text-2xl font-bold px-6 py-4">
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
            <p className="text-xl font-medium">vs Big Poppas</p>
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
                open={open}
                onOpenChange={setOpen}
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
                    <SelectItem value="not-attending">Not Attending</SelectItem>
                    <SelectItem value="undecided">Undecided</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
