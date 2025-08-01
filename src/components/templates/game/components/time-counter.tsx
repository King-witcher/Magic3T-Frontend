import { TimerValue, Tooltip } from '@/components/atoms'
import type { Timer } from '@/lib/Timer'
import { Flag } from 'lucide-react'

interface Props {
  timer: Timer
  pause: boolean
  showSurrender?: boolean
  onClickSurrender?: () => void
}

export function TimeCounter({
  timer,
  pause,
  showSurrender,
  onClickSurrender,
}: Props) {
  return (
    <div className="acrylic center h-[50px] w-full text-lg tracking-wider relative">
      <TimerValue timer={timer} pause={pause} />
      {showSurrender && (
        <Tooltip label='Surrender'>
          <Flag
            className="absolute right-3 cursor-pointer text-gold-4"
            onClick={onClickSurrender}
          />
        </Tooltip>
      )}
    </div>
  )
}
