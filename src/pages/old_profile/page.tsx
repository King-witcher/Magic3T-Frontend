import { useAuth } from '@/contexts/AuthContext'
import {
  Center,
  Spinner,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useQuery,
} from '@chakra-ui/react'
import ProfileTab from './Profile/ProfileTab'
import HistoryTab from './History/HistoryTab'
import SignInPage from '@/components/SignInPage'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAsync } from '@/hooks/useAsync'
import { models } from '@/models'
import { matches } from '@/models/matches'
import { useQueryParams } from '@/hooks/useQueryParams'
import { UserData } from '@/models/users/User'
import { GiBrokenArrow } from 'react-icons/gi'
import StandingsTab from './Standings/StandingsTab'

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
  const { user: authUser } = useAuth()
  const params = useQueryParams()
  const uidParam = params.get('uid')

  const [matches, loadingMatches] = useAsync(async () => {
    return authUser
      ? models.matches.listByPlayerId(uidParam ?? authUser._id)
      : []
  }, [uidParam, authUser?._id])

  const [profile, loadingProfile] = useAsync(async () => {
    return uidParam ? models.users.getById(uidParam) : authUser
  }, [uidParam, authUser?._id])

  if (!authUser) return <SignInPage />

  if (loadingMatches || loadingProfile)
    return (
      <Center h="full">
        <Spinner />
      </Center>
    )

  if (!profile)
    return (
      <VStack h="100%" justifyContent="center">
        <GiBrokenArrow size="36px" />
        <Text fontSize="20px">Perfil não encontrado</Text>
      </VStack>
    )

  return (
    <Tabs index={index} isLazy>
      <TabList>
        <Link to={uidParam ? `/profile/?uid=${uidParam}` : '/profile/'}>
          <Tab>Perfil</Tab>
        </Link>
        <Link
          to={
            uidParam ? `/profile/history/?uid=${uidParam}` : '/profile/history/'
          }
        >
          <Tab>Histórico</Tab>
        </Link>
        <Link
          to={
            uidParam
              ? `/profile/standings/?uid=${uidParam}`
              : '/profile/standings/'
          }
        >
          <Tab>Ranking</Tab>
        </Link>
      </TabList>
      <TabIndicator />
      <TabPanels>
        <TabPanel>
          <ProfileTab user={profile} />
        </TabPanel>
        <TabPanel>
          <HistoryTab matches={matches} />
        </TabPanel>
        <TabPanel>
          <StandingsTab />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
