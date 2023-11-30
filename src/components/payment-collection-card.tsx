'use client'

import { motion, useAnimate, useMotionValue } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Mail } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import NumberTicker from './magicui/number-ticker'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Card } from './ui/card'

export default function PaymentCollectionCard() {
  const [settleCount, setSettleCount] = useState(12)
  const [settleAmount, setSettleAmount] = useState(230)
  const animatedSettleAmount = useMotionValue(settleAmount)
  const [scope, animate] = useAnimate()
  const [scope2, animate2] = useAnimate()
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    const controls = animate(animatedSettleAmount, settleAmount, {
      duration: 1,
    })
    return controls.stop
  }, [settleAmount])

  function settlePaymentSimulation() {
    if (settled) return
    setSettleCount((count) => count + 1)
    setSettleAmount(settleAmount + 20)
    setSettled(true)
    animate(
      scope.current,
      { opacity: 0, x: 0, rotate: -45 },
      { duration: 0.8, type: 'spring', bounce: 0.5 }
    )
    animate2(
      scope2.current,
      { opacity: 1, x: -5, rotate: 0 },
      { duration: 0.8, type: 'spring', bounce: 0.5 }
    )
  }

  return (
    <motion.div
      className="flex w-full max-w-[400px] items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      viewport={{ once: true, margin: '-200px' }}
    >
      <Card className="rounded-2xl flex flex-col w-full p-8 shadow-2xl">
        <p className="text-xl lg:text-2xl font-bold">Match Fee Collection</p>
        <div className="flex items-center">
          <p className="font-bold text-2xl">
            $<NumberTicker value={settleAmount} />
          </p>
          <p className="text-muted-foreground mt-1 ml-1">({settleCount}/16)</p>
        </div>
        <div className="flex flex-col py-2 items-start">
          <div className="flex items-center space-x-1">
            <p className="font-medium text-secondary-foreground text-xl">
              Received
            </p>
            <CheckCircle2
              size={15}
              strokeWidth={2}
              className="text-green-500"
            />
          </div>
          <div className="flex items-center">
            <Image src={'/heads.png'} alt="heads" width={150} height={20} />
            <motion.div
              className=""
              ref={scope2}
              initial={{ opacity: 0, x: 5, rotate: 45 }}
            >
              <Avatar className="mr-1 h-9 w-9">
                <AvatarImage src={'/single-face.png'} />
              </Avatar>
            </motion.div>
          </div>
        </div>
        <div className="flex flex-col py-2 items-start">
          <div className="items-center flex flex-col">
            <div className="flex items-center space-x-1">
              <p className="text-xs text-muted-foreground">
                Automatic reminder in 1 hour
              </p>
              <Mail size={10} className="text-muted-foreground" />
            </div>
            <div className="flex items-center w-full space-x-1">
              <p className="font-medium text-secondary-foreground text-xl">
                Pending
              </p>
              <AlertTriangle
                size={15}
                strokeWidth={2}
                className="text-red-500 mt-1"
              />
            </div>
          </div>
          <div className="flex items-center">
            <Image
              src={'/heads-small.png'}
              alt="heads"
              width={90}
              height={10}
            />
            <motion.div
              className=""
              ref={scope}
              initial={{ opacity: 1, x: -5 }}
            >
              <Avatar className="mr-1 h-8 w-8">
                <AvatarImage src={'/single-face.png'} />
              </Avatar>
            </motion.div>
          </div>
        </div>
        <div className="w-full flex justify-end">
          <Button
            onClick={settlePaymentSimulation}
            className={cn(settled && 'bg-green-400 hover:bg-green-300')}
          >
            {settled ? 'Payment complete' : 'Settle payment'}
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
