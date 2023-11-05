'use client'

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import { useEffect, useState } from 'react'
import ReactTimeAgo from 'react-time-ago'

export default function TimeAgoClient({
  date,
  locale,
}: {
  date: Date
  locale: string
}) {
  // TODO: Fix
  const [isReady, setIsReady] = useState(false)
  useEffect(() => {
    TimeAgo.addLocale(en)
    setIsReady(true)
  }, [])

  return <>{isReady && <ReactTimeAgo date={date} locale={locale} />}</>
}
