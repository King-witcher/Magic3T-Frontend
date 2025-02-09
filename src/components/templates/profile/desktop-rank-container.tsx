import { League } from '@/services/nest-api'
import { leaguesMap } from '@/utils/ranks'

interface Props {
  title: string
  league: League
  content: string
  extra: string
  progress: number
}

export function DesktopRankContainer({
  title,
  league,
  extra,
  progress,
  content: rankName,
}: Props) {
  const leagueInfo = leaguesMap[league]

  return (
    <div className="rank-container flex flex-col items-center select-none">
      <img
        className="ml-[3px] w-[250px]"
        src={leagueInfo.emblem}
        alt="rank"
        draggable={false}
      />
      <div className="flex flex-col items-center">
        <p className="text-xl">{title}</p>
        <p className="text-lg font-bold capitalize">{rankName}</p>
        <p className="text-xs font-medium text-[#ffffffc0]">{extra}</p>
      </div>

      <div className="flex items-stretch mt-[10px] h-[8px] rounded-[999px] overflow-hidden gap-[1px] w-[250px]">
        {progress > 0 && (
          <div className="bg-[#ffffffc0]" style={{ flex: progress }} />
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
