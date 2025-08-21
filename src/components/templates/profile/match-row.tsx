import { getDateFromId } from '@/lib/utils'
import { acrylicClasses } from '@/styles/tailwind'
import { MatchPayload, MatchPayloadEvents, Team } from '@magic3t/types'
import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { FaClock } from 'react-icons/fa'
import { RiFlagFill } from 'react-icons/ri'

interface Props {
  match: MatchPayload
  viewAs: string
}

export enum MatchResult {
  Defeat = 'defeat',
  Draw = 'draw',
  Victory = 'victory',
}

const resultColorMap: Record<MatchResult, string> = {
  [MatchResult.Defeat]: 'bg-red-700',
  [MatchResult.Draw]: 'bg-gray-400',
  [MatchResult.Victory]: 'bg-green-500',
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
  const date = getDateFromId(match.id)

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
      <div className="flex flex-col gap-[10px] p-[20px] transition-all duration-100 cursor-pointer hover-acrylic hover:bg-[#ffffff40]">
        <div className="flex">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-serif tracking-wider !text-lg">
                {opponent.nickname}
              </h3>
              {!!player.lpGain && (
                <p
                  className={`text-sm/normal !font-serif font-bold ${player.lpGain > 0 ? 'text-green-500' : 'text-red-500'}`}
                >
                  {player.lpGain > 0 && '+'}
                  {player.lpGain}
                </p>
              )}
            </div>
            <p className="text-xs/normal text-grey-1">
              {dateTimeFormat.format(date)} - {durationString}
            </p>
          </div>
          <span
            className={`flex items-center justify-center ml-auto rounded-[9999px] capitalize font-bold text w-[80px] h-[25px] ${resultColorMap[result]} ${isDefeat ? 'text-white' : 'text-black'}`}
          >
            {result}
          </span>
        </div>
        <div className="flex gap-2 sm:gap-2.5">
          {match.events.map((event) => {
            const borderColor =
              event.side === Team.Order ? '!border-blue-400' : '!border-red-400'

            if (event.event === MatchPayloadEvents.Message) return null

            return (
              <div
                className={`flex items-center text-sm leading-normal justify-center h-[22px] sm:h-[25px] w-[22px] sm:w-[25px] !border-2 rounded-lg ${borderColor} ${acrylicClasses}`}
                key={event.time}
              >
                {event.event === MatchPayloadEvents.Choice && event.choice}
                {event.event === MatchPayloadEvents.Forfeit && <RiFlagFill />}
                {event.event === MatchPayloadEvents.Timeout && <FaClock />}
              </div>
            )
          })}
        </div>
      </div>
    </Link>
  )
}
