import { LazyLoadData } from '@/hooks/useLazy'
import { UserData } from '@/models/users/User'
import {
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import LazyLoadingPage from './components/LazyLoadingPage'
import ProfileTab from './components/ProfileTab'
import HistoryTab from './components/HistoryTab'
import { Match } from '@/models/matches/Match'
import { Link } from 'react-router-dom'
import StandingsTab from './components/StandingsTab'

interface Props {
  user: UserData
  lazyMatchLoader: LazyLoadData<Match[]>
  lazyStandingsLoader: LazyLoadData<UserData[]>
  baseUrl: string
  index: 0 | 1 | 2
}

export default function ProfileView({
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
            <StandingsTab standings={standings} />
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
