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
      <Tabs variant="unstyled" h="100%" display="flex" flexDir="column">
        <TabList>
          <Tab>Perfil</Tab>
          <Tab>Histórico</Tab>
        </TabList>
        <TabIndicator
          position="relative !important"
          flex="1 0 3px"
          mt="-1.5px"
          height="2px"
          bg="pink.500"
          borderRadius="5px"
        />
        <TabPanels flex="0 1 100%">
          <TabPanel h="100%">
            <ProfilePanel user={user} />
          </TabPanel>
          <TabPanel h="100%">
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
