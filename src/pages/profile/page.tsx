import { useAuth } from '@/contexts/AuthContext'
import {
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import ProfileTab from './tabs/ProfileTab'
import HistoryTab from './tabs/HistoryTab'
import SignInPage from '@/components/SignInPage'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAsync } from '@/hooks/useAsync'
import { models } from '@/models'
import { matches } from '@/models/matches'

type Params = {
  matchId: string
}

interface Props {
  index: 0 | 1 | 2
}

const pathIndexMap: Record<string, number> = {
  history: 1,
  standings: 2,
}

export default function ProfilePage({ index }: Props) {
  const { user, logged } = useAuth()
  const { matchId } = useParams<Params>()
  const matchLoader = useAsync(async () => {
    if (user) return models.matches.listByPlayerId(user.uid)
    else return []
  })

  if (!user) return <SignInPage />

  return (
    <Tabs index={index}>
      <TabList>
        <Link to="/profile/">
          <Tab>Perfil</Tab>
        </Link>
        <Link to="/profile/history/">
          <Tab>Histórico</Tab>
        </Link>
        <Tab isDisabled>Classificações</Tab>
      </TabList>
      <TabIndicator />
      <TabPanels>
        <TabPanel>
          <ProfileTab user={user} />
        </TabPanel>
        <TabPanel>
          <HistoryTab user={user} matchLoader={matchLoader} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
