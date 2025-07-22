import { Spinner } from '@/components/atoms'
import { UserAvatar } from '@/components/molecules'
import { ChangeIconModal } from '@/components/organisms/modals/change-icon-modal'
import { useAuth } from '@/contexts/auth.context'
import { useModalStore } from '@/contexts/modal.store'
import { Api } from '@/services/api'
import { leaguesMap } from '@/utils/ranks'
import { League, MatchDto, Profile } from '@magic3t/types'
import { UseQueryResult, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { DesktopRankContainer } from './desktop-rank-container'
import { MatchRow } from './match-row'
import { MobileRankContainer } from './mobile-rank-container'

interface Props {
  user: Profile
  matchesQuery: UseQueryResult<MatchDto[], Error>
  editable?: boolean
}

const divisionMap = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
}

export function ProfileTemplate({ user, matchesQuery, editable }: Props) {
  const { user: authenticatedUser, getToken } = useAuth()
  const leagueInfo = leaguesMap[user.rating.league]
  const client = useQueryClient()

  const openChangeIconModal = useModalStore((state) => state.openModal)

  const progress = user.rating.points ?? (user.rating.progress || 0)

  async function saveIconChange(iconId: number) {
    await Api.patch(
      'users/me/icon',
      {
        iconId,
      },
      {
        headers: {
          Authorization: `${await getToken()}`,
        },
      }
    )
    await client.refetchQueries({
      queryKey: ['myself', authenticatedUser?.id],
    })

    console.log('refetched')
  }

  const changeIcon = useCallback(() => {
    openChangeIconModal(<ChangeIconModal user={user} onSave={saveIconChange} />)
  }, [user, saveIconChange])

  return (
    <main className="profile-template !flex flex-col justify-center w-full gap-[40px] pb-[40px]">
      <section className="flex flex-col items-center self-center">
        <UserAvatar
          icon={user.summonerIcon}
          league={user.rating.league}
          division={user.rating.division}
          type="wing"
          className={`text-[140px] m-[40px] mt-[150px] ${editable ? 'cursor-pointer' : ''}`}
          onClick={editable ? changeIcon : undefined}
          showPencil={editable}
        />
        <h1 className="!text-4xl/[39px] flex items-center gap-[8px] text-center font-serif p-[5px] !font-bold rounded-[10px]">
          {(user.role === 'bot' || user.role === 'creator') && (
            <span className="uppercase text-gold-4">{user.role}</span>
          )}
          <span>{user.nickname}</span>
        </h1>
      </section>

      {/* Desktop ranks */}
      <div className="ranks hidden md:flex items-center w-full justify-evenly">
        <DesktopRankContainer
          title="League"
          rankName={`${leagueInfo.name} ${user.rating.division ? divisionMap[user.rating.division] : ''} - ${
            user.rating.league === League.Provisional
              ? `${progress}%`
              : `${user.rating.points} LP`
          }`}
          extra={`${user.stats.wins} wins - ${user.stats.draws} draws - 
              ${user.stats.defeats} defeats`}
          league={user.rating.league}
          progress={progress}
        />
        <DesktopRankContainer
          title="Experience"
          rankName="Coming soon"
          extra="0 xp"
          league={League.Provisional}
          progress={0}
        />
      </div>

      {/* Mobile ranks */}
      <section className="mobile-ranks flex flex-col md:hidden gap-[10px]">
        <MobileRankContainer
          title="Stats"
          content={`${user.stats.wins} wins - ${user.stats.draws} draws - ${user.stats.defeats} defeats`}
        />

        <MobileRankContainer
          title="Rating"
          content={`${leagueInfo.name} ${user.rating.division && divisionMap[user.rating.division]} - ${
            user.rating.league === League.Provisional
              ? `${progress}%`
              : `${user.rating.points} LP`
          }`}
          league={user.rating.league}
        />

        <MobileRankContainer
          title="Experience"
          content="Coming soon"
          league={League.Provisional}
        />
      </section>

      <section className="flex flex-col gap-[10px] mt-[20px]">
        <h2 className="!text-4xl font-serif text-gold-3 uppercase">
          {matchesQuery.data &&
            matchesQuery.data.length >= 20 &&
            'Last 20 matches'}

          {matchesQuery.data &&
            matchesQuery.data.length < 20 &&
            `${matchesQuery.data.length} recent match${matchesQuery.data.length > 1 ? 'es' : ''}`}

          {matchesQuery.isPending &&
            matchesQuery.isFetching &&
            'Recent matches'}
        </h2>

        {matchesQuery.isPending && matchesQuery.isFetching && (
          <div className="center my-[25px] flex-col gap-[5px]">
            <div className="size-[50px]">
              <Spinner />
            </div>
          </div>
        )}

        {matchesQuery.isSuccess && (
          <div className="flex flex-col gap-[10px] mt-[20px]">
            {matchesQuery.data.map((match) => (
              <MatchRow key={match.id} match={match} viewAs={user.id} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
