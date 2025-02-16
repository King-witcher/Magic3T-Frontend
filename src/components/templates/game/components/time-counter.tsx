import { TimerValue } from '@/components/atoms'
import type { Timer } from '@/lib/Timer'

interface Props {
  timer: Timer
  pause: boolean
}

export function TimeCounter({ timer, pause }: Props) {
  return (
    <div className="acrylic center h-[50px] w-full text-lg tracking-wider">
      <TimerValue timer={timer} pause={pause} />
    </div>
  )
}
