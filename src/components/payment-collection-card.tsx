'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Mail } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import { Button } from './ui/button'
import { Card } from './ui/card'

export default function PaymentCollectionCard() {
  return (
    <motion.div
      className=""
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      viewport={{ once: true, margin: '-200px' }}
    >
      <Card className="rounded-2xl max-w-[400px] p-8 shadow-2xl">
        <p className="text-3xl font-bold">Match Fee Collection</p>
        <div className="flex items-center">
          <p className="font-bold text-2xl">$230</p>
          <p className="text-muted-foreground mt-1 ml-1">(12/15)</p>
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
          <Image src={'/heads.png'} alt="heads" width={150} height={20} />
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
          <Image src={'/heads-small.png'} alt="heads" width={90} height={10} />
        </div>
        <div className="w-full flex justify-end">
          <Button>Settle Payment</Button>
        </div>
      </Card>
    </motion.div>
  )
}
