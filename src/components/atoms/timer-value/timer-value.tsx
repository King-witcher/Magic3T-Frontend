import type { Timer } from '@/lib/Timer'
import { useEffect, useState } from 'react'

interface Props {
  timer: Timer
  /** Pauses the continuous re-render caused by this component. */
  pause?: boolean
}

function format(timer: Timer): string {
  const time = timer.getRemaining()
  const timeSecs = (time / 1000) % 60
  const timeMins = time / 60_000

  if (time > 10_000) {
    return `${Math.floor(timeMins)}:${Math.floor(timeSecs)
      .toFixed()
      .padStart(2, '0')}`
  }
  return `${timeSecs.toFixed(2)}`
}

export function TimerValue({ timer, pause }: Props) {
  const [time, setTime] = useState(format(timer))

  useEffect(() => {
    let isMounted = true
    function tick() {
      if (!isMounted) return
      setTime(format(timer))
      window.requestAnimationFrame(tick)
    }

    if (!pause) {
      window.requestAnimationFrame(tick)
    }

    return () => {
      isMounted = false
    }
  }, [timer, pause])

  return time
}
