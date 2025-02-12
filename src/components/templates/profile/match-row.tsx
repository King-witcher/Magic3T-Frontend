import { MatchDto, MatchEventType, Team } from '@/services/nest-api'
import { acrylicClasses } from '@/styles/tailwind'
import { MatchResult } from '@/types'
import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { FaClock } from 'react-icons/fa'
import { RiFlagFill } from 'react-icons/ri'

interface Props {
  match: MatchDto
  viewAs: string
}

const resultColorMap: Record<MatchResult, string> = {
  [MatchResult.Defeat]: 'bg-[#c02040]',
  [MatchResult.Draw]: 'bg-[#b0b0c0]',
  [MatchResult.Victory]: 'bg-[#00c020]',
}

const dateTimeFormat = Intl.DateTimeFormat()

export function MatchRow({ match, viewAs }: Props) {
  const team = match.teams[Team.Order].id === viewAs ? Team.Order : Team.Chaos
  const result =
    match.winner === null
      ? MatchResult.Draw
      : match.winner === team
        ? MatchResult.Victory
        : MatchResult.Defeat

  const isDefeat = result === MatchResult.Defeat
  const isDraw = result === MatchResult.Draw
  const isVictory = result === MatchResult.Victory

  const player =
    match.teams[Team.Order].id === viewAs
      ? match.teams[Team.Order]
      : match.teams[Team.Chaos]
  const opponent =
    match.teams[Team.Order].id === viewAs
      ? match.teams[Team.Chaos]
      : match.teams[Team.Order]

  const durationString = useMemo(() => {
    const duration = Math.floor(
      match.events[match.events.length - 1].time / 1000
    )
    const secs = duration % 60
    const mins = (duration - secs) / 60

    if (mins > 0) return `${mins}m ${secs}s`
    return `${secs}s`
  }, [match])

  return (
    <Link to="/users/id/$userId" params={{ userId: opponent.id }}>
      <div
        className={`flex flex-col gap-[10px] p-[20px] transition-all duration-100 cursor-pointer ${acrylicClasses} hover:bg-[#ffffff40]`}
      >
        <div className="flex">
          <div className="flex flex-col">
            <div className="flex items-center gap-[10px]">
              <p className="font-bold">{opponent.nickname}</p>
              {!!player.ratingGain && (
                <p
                  className={`text-sm/normal font-bold ${player.ratingGain > 0 ? 'text-[#00c020]' : 'text-[#ff4000]'}`}
                >
                  {player.ratingGain > 0 ? '+' : '-'}
                  {Math.abs(player.ratingGain)}
                </p>
              )}
            </div>
            <p className="text-xs/normal opacity-70">
              {dateTimeFormat.format(match.time)} - {durationString}
            </p>
          </div>
          <div
            className={`flex items-center justify-center ml-auto rounded-[9999px] capitalize font-bold text-sm w-[80px] h-[25px] ${resultColorMap[result]} ${isDefeat ? 'text-white' : 'text-black'}`}
          >
            {result}
          </div>
        </div>
        <div className="flex gap-2 sm:gap-2.5">
          {match.events.map((event) => {
            const borderColor =
              event.side === Team.Order ? '!border-blue-400' : '!border-red-400'

            if (event.event === MatchEventType.Message) return null

            return (
              <div
                className={`flex items-center text-sm leading-normal justify-center h-[22px] sm:h-[25px] w-[22px] sm:w-[25px] !border-2 rounded-lg ${borderColor} ${acrylicClasses}`}
                key={event.time}
              >
                {event.event === MatchEventType.Choice && event.choice}
                {event.event === MatchEventType.Forfeit && <RiFlagFill />}
                {event.event === MatchEventType.Timeout && <FaClock />}
              </div>
            )
          })}
        </div>
      </div>
    </Link>
  )
}
