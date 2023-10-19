import { useAuth } from '@/contexts/AuthContext'
import {
  Avatar,
  Center,
  Input,
  Stack,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import ProfilePanel from './panels/ProfilePanel'
import HistoryPanel from './panels/HistoryPanel'

export default function ProfilePage() {
  const { user } = useAuth()

  const [name, setName] = useState(user?.displayName || '')

  if (user)
    return (
      <Tabs>
        <TabList>
          <Tab>Perfil</Tab>
          <Tab>Histórico</Tab>
          <Tab isDisabled>Classificações</Tab>
        </TabList>
        <TabIndicator />
        <TabPanels>
          <TabPanel>
            <ProfilePanel user={user} />
          </TabPanel>
          <TabPanel>
            <HistoryPanel user={user} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    )
  else
    return (
      <Center w="100%" h="100%">
        <Text>Você precisa estar logado para ver o seu perfil de usuário.</Text>
      </Center>
    )
}
