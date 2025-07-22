import { SmoothNumber } from '@/components/atoms'
import { UserAvatar } from '@/components/molecules'
import { useGame } from '@/contexts/game.context.tsx'
import { divisionMap, leaguesMap } from '@/utils/ranks'
import { block } from '@/utils/utils'
import { keyframes } from '@emotion/react'
import { League, Team } from '@magic3t/types'
import { Link } from '@tanstack/react-router'

interface Props {
  team: Team
  className?: string
}

const appear = keyframes`
  from {
    opacity: 0;
  } to {
    opacity: 1;
  }
`

export function PlayerCard({ team, className }: Props) {
  const game = useGame()
  const teamInfo = game.teams[team]
  const profile = teamInfo.profile

  const tierInfo = profile ? leaguesMap[profile?.rating.league] : null

  const gain = block(() => {
    if (teamInfo.gain === null) return null
    const gain = teamInfo.gain
    return Math.round(gain)
  })

  if (!game.isActive) return null

  return (
    <Link
      to="/users/id/$userId"
      params={{ userId: profile?.id || '' }}
      className={`flex hover-acrylic items-center justify-start gap-[20px] p-[20px] w-[400px] duration-200 overflow-hidden ${className}`}
    >
      <UserAvatar
        icon={profile?.summonerIcon || 0}
        league={profile?.rating.league || League.Provisional}
        division={profile?.rating.division || null}
        className="text-[70px] m-[10px_20px]"
      />
      <div className="flex flex-col gap-[5px]">
        {profile && (
          <>
            <div className="flex items-center gap-[5px]">
              <h2 className="one-line flex gap-2 !text-xl font-serif tracking-wide">
                {profile.role === 'bot' && (
                  <span className="text-gold-4 uppercase">Bot</span>
                )}
                <span>{profile.nickname}</span>
              </h2>
            </div>
            <div className="flex items-center text-xs xs:text-sm gap-[5px] font-serif tracking-wide whitespace-nowrap">
              <img alt="rank" className="w-[25px]" src={tierInfo?.icon} />
              <span className="capitalize">
                {profile.rating.league}{' '}
                {divisionMap[profile.rating.division || 0]}
              </span>
              {profile.rating.points !== null && (
                <span className="text-grey-1">
                  - <SmoothNumber value={profile.rating.points || 0} /> LP
                </span>
              )}

              {gain !== null && (
                <span
                  className={`font-bold ${gain < 0 ? 'text-red-600' : gain > 0 ? 'text-green-600' : 'text-grey-1'}`}
                  color={
                    gain < 0 ? 'red.500' : gain > 0 ? 'green.500' : 'gray.500'
                  }
                >
                  {gain >= 0 && '+'}
                  {gain}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </Link>
  )
}
