import type { UserData } from '@/models/users/user'
import {
  Box,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import { HistoryTab, ProfileTab, RankingTab } from './tabs'
import { Link } from '@tanstack/react-router'
import { getAcrylicProps } from '@/utils/style-helpers'

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
    // <Box {...getAcrylicProps()} minH="full" p="10px">
    //   <Tabs index={indexMap[index] || 0} isLazy>
    //     <TabList>
    //       <Link to={`${baseUrl}/profile`} preload="viewport">
    //         <Tab>Perfil</Tab>
    //       </Link>
    //       <Link to={`${baseUrl}/history`}>
    //         <Tab>Histórico</Tab>
    //       </Link>
    //       <Link to={`${baseUrl}/standings`}>
    //         <Tab>Ranking</Tab>
    //       </Link>
    //     </TabList>
    //     <TabIndicator />
    //     <TabPanels>
    //       <TabPanel>
    //         <ProfileTab user={user} />
    //       </TabPanel>
    //       <TabPanel>
    //         <HistoryTab referenceUid={user._id} />
    //       </TabPanel>
    //       <TabPanel>
    //         <RankingTab />
    //       </TabPanel>
    //     </TabPanels>
    //   </Tabs>
    // </Box>
    <ProfileTab user={user} />
  )
}
