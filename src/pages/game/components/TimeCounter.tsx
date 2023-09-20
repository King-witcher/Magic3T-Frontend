import { Timer } from '@/lib/Timer'
import { useEffect, useState } from 'react'

interface Props {
  timer: Timer
}

function format(timer: Timer): string {
  const time = timer.getRemaining()
  const timeSecs = (time / 1000) % 60
  const timeMins = time / 60_000

  if (time > 10_000) {
    return `${Math.floor(timeMins)}:${Math.floor(timeSecs)
      .toFixed()
      .padStart(2, '0')}`
  } else {
    return `${timeSecs.toFixed(1)}`
  }
}

export function TimeCounter({ timer }: Props) {
  const [time, setTime] = useState('')

  useEffect(() => {
    let isMounted = true
    function tick() {
      if (!isMounted) return
      setTime(format(timer))
      window.requestAnimationFrame(tick)
    }

    tick()

    return () => {
      isMounted = false
    }
  }, [])

  return <>{time}</>
}
