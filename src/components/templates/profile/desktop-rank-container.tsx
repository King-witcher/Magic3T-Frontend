import { leaguesMap } from '@/utils/ranks'
import { League } from '@magic3t/types'

interface Props {
  title: string
  league: League
  rankName: string
  extra: string
  progress: number
}

export function DesktopRankContainer({
  title,
  league,
  extra,
  progress,
  rankName,
}: Props) {
  const leagueInfo = leaguesMap[league]

  return (
    <div className="rank-container flex flex-col items-center select-none">
      <img
        className="ml-[3px] w-[250px]"
        src={leagueInfo.emblem}
        alt={league}
        draggable={false}
      />
      <div className="flex flex-col items-center">
        <p className="text-2xl !font-serif text-gold-4">{title}</p>
        <p className="text-lg capitalize">{rankName}</p>
        <p className="text-xs font-medium text-grey-1">{extra}</p>
      </div>

      <div className="flex items-stretch mt-[10px] h-[8px] rounded-[999px] overflow-hidden gap-[1px] w-[250px]">
        {progress > 0 && (
          <div className="bg-gold-4" style={{ flex: progress }} />
        )}
        {progress < 100 && (
          <div
            className="bg-[#ffffff30] overflow-hidden"
            style={{ flex: 100 - progress }}
          />
        )}
      </div>
    </div>
  )
}
