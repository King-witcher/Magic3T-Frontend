import type { Timer } from '@/lib/Timer'
import { Text, type TextProps } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

interface Props extends TextProps {
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
  }
  return `${timeSecs.toFixed(2)}`
}

export function TimeCounter({ timer, ...rest }: Props) {
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
  }, [timer])

  return <Text {...rest}>{time}</Text>
}
