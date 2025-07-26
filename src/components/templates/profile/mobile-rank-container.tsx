import { leaguesMap } from '@/utils/ranks'
import { League } from '@magic3t/types'

interface Props {
  title: string
  content: string
  league?: League
}

export function MobileRankContainer({ title, content: rank, league }: Props) {
  const leagueInfo = league && leaguesMap[league]

  return (
    <div className="flex items-center justify-between relative h-[70px]">
      <h2 className="!text-sm absolute top-0 left-0 text-gold-4 !font-bold font-serif">
        {title}
      </h2>
      <span className="font-serif">{rank}</span>
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
