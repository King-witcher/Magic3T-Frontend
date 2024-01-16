import { LazyLoadData, useLazy } from '@/hooks/useLazy'
import { models } from '@/models'
import { UserData } from '@/models/users/User'
import StandingsTab from '@/pages/profile/Standings/StandingsTab'
import {
  Center,
  Link,
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

interface Props {
  user: UserData
  lazyMatchLoader: LazyLoadData<Match[]>
}

export default function ProfileView({
  user,
  lazyMatchLoader: [matches, loadingMatches, loadMatches],
}: Props) {
  return (
    <Tabs isLazy>
      <TabList>
        <Tab>Perfil</Tab>
        <Tab>Histórico</Tab>
        <Tab>Ranking</Tab>
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
          <StandingsTab />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
