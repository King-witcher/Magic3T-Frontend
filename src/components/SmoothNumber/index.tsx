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
      const newValue = smoothValue + distance * deltaTime

      if (Math.abs(newValue - smoothValue) > Math.abs(distance)) {
        setSmoothValue(value)
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
