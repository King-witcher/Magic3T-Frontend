import type { UserData } from '@/models/users/User'
import {
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import { HistoryTab, ProfileTab, RankingTab } from './tabs'
import { Link } from '@tanstack/react-router'

interface Props {
  user: UserData
  baseUrl: string
  index: string
}

const indexMap: Record<string, number> = {
  profile: 0,
  history: 1,
  standings: 2,
}

export function ProfileTemplate({ user, index, baseUrl }: Props) {
  return (
    <Tabs index={indexMap[index] || 0} isLazy>
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
          <HistoryTab referenceUid={user._id} />
        </TabPanel>
        <TabPanel>
          <RankingTab />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
