import { Timer } from '@/lib/Timer'
import { useEffect, useState } from 'react'

interface Props {
  timer: Timer
}

function format(timer: Timer): string {
  const time = timer.getRemaining()

  if (time > 10_000) {
    return `${(time / 60_000).toFixed()}:${((time / 1000) % 60).toFixed()}`
  } else {
    return `${(time / 1000).toFixed(1)}`
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
