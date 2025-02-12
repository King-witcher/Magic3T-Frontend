import { League } from '@/services/nest-api'
import { leaguesMap } from '@/utils/ranks'

interface Props {
  title: string
  content: string
  league?: League
}

export function MobileRankContainer({ title, content: rank, league }: Props) {
  const leagueInfo = league && leaguesMap[league]

  return (
    <div className="flex items-center justify-between relative h-[70px]">
      <span className="text-xs absolute top-0 left-0">{title}</span>
      <span className="font-bold">{rank}</span>
      {league && (
        <img
          className="w-[50px] aspect-square absolute right-0 top-1/2 -translate-y-7/10"
          alt={leagueInfo?.name}
          src={leagueInfo?.icon}
        />
      )}
    </div>
  )
}
