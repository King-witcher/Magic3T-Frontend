import type { LazyLoadData } from '@/hooks/useLazy'
import type { MatchModel } from '@/models/matches/Match'
import type { UserData } from '@/models/users/User'
import {
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { LazyLoadingPage } from './components'
import { HistoryTab, ProfileTab, RankingTab } from './tabs'

interface Props {
  user: UserData
  lazyMatchLoader: LazyLoadData<MatchModel[]>
  lazyStandingsLoader: LazyLoadData<UserData[]>
  baseUrl: string
  index: 0 | 1 | 2
}

export function ProfileView({
  user,
  lazyMatchLoader: [matches, loadingMatches, loadMatches],
  lazyStandingsLoader: [standings, loadingStandings, loadStandings],
  index,
  baseUrl,
}: Props) {
  return (
    <Tabs index={index} isLazy>
      <TabList>
        <Link to={`${baseUrl}/profile`}>
          <Tab>Perfil</Tab>
        </Link>
        <Link to={`${baseUrl}/history`}>
          <Tab>Histórico</Tab>
        </Link>
        <Link to={`${baseUrl}/standings`}>
          <Tab>Ranking</Tab>
        </Link>
      </TabList>
      <TabIndicator />
      <TabPanels>
        <TabPanel>
          <ProfileTab user={user} />
        </TabPanel>
        <TabPanel>
          {matches ? (
            <HistoryTab matches={matches} referenceUid={user._id} />
          ) : (
            <LazyLoadingPage
              lazyLoadData={[matches, loadingMatches, loadMatches]}
            />
          )}
        </TabPanel>
        <TabPanel>
          {standings ? (
            <RankingTab standings={standings} />
          ) : (
            <LazyLoadingPage
              lazyLoadData={[standings, loadingStandings, loadStandings]}
            />
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
