import { useEffect, useState } from 'react'

interface Props {
  value: number
}

export default function SmoothNumber({ value }: Props) {
  const [smoothValue, setSmoothValue] = useState(value)

  useEffect(() => {
    let mounted = true
    function tick(startTime: number) {
      if (!mounted) return

      const distance = value - smoothValue
      const deltaTime = (Date.now() - startTime) / 1000

      const easeFactor = 0 - 8 ** (0 - deltaTime) + 1

      const newValue = smoothValue + easeFactor * distance

      if (Math.abs(newValue - smoothValue) >= Math.abs(distance) - 1) {
        setSmoothValue(value)
        console.log('stop', deltaTime)
        return
      }

      setSmoothValue(newValue)
      requestAnimationFrame(() => tick(startTime))
    }

    tick(Date.now())

    return () => {
      mounted = false
    }
  }, [value])

  return Math.round(smoothValue)
}
