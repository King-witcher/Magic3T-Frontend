import { League, NestApi } from '@/services/nest-api'
import { divisionMap, leaguesMap } from '@/utils/ranks'
import { getIconUrl } from '@/utils/utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

export function RankingTemplate() {
  const rankingQuery = useSuspenseQuery({
    queryKey: ['ranking'],
    staleTime: 120 * 1000,
    async queryFn() {
      return await NestApi.User.getRanking()
    },
  })

  return (
    <>
      <h1 className="!text-[6vw] sm:!text-4xl font-serif !font-semibold text-gold-4 uppercase text-tred">
        Top Magic3T players
      </h1>
      {rankingQuery.isSuccess && (
        <div className="flex flex-col gap-[10px] mt-[20px] overflow-hidden">
          {rankingQuery.data.map((user, index) => {
            const isProvisional = user.rating.league === League.Provisional
            const isApex = user.rating.league === League.Master
            const leagueInfo = leaguesMap[user.rating.league]
            return (
              <Link
                className={`hover-acrylic flex tracking-wide font-serif gap-[5px] items-center p-[20px_15px] sm:p-[18px_20px] sm:gap-[10px] duration-200] ${isProvisional ? 'opacity-50' : ''}`}
                from="/ranking"
                to="/users/$nickname"
                params={{ nickname: user.nickname?.replaceAll(' ', '') ?? '' }}
                key={user.id}
              >
                <span className="font-bold text-lg flex-[0_0_25px] text-grey-1">
                  {isProvisional ? '' : `#${index + 1}`}
                </span>{' '}
                <div className="flex items-center gap-[8px] text-sm xs:text-[1rem] overflow-hidden">
                  <img
                    className="size-[30px] rounded-[999px] !border-2 !border-grey-1"
                    alt="icon"
                    src={getIconUrl(user.summonerIcon)}
                  />
                  {(user.role === 'bot' || user.role === 'creator') && (
                    <span className="text-gold-4 uppercase">{user.role}</span>
                  )}
                  <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {user?.nickname ?? '?'}
                  </span>
                </div>
                {/* Rank Icon Box */}
                <div className="flex items-center ml-auto gap-[5px] whitespace-nowrap">
                  <img
                    className="w-[30px]"
                    alt={leagueInfo.name}
                    title={leagueInfo.name}
                    src={leagueInfo.icon}
                  />
                  <span className="text-center h-[1fr] min-w-[20px]">
                    {!isProvisional &&
                      !isApex &&
                      divisionMap[user.rating.division || 1]}

                    {isApex && `${user.rating.points} LP`}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
