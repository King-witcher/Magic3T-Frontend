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

export default function ProfilePage() {
  const { user } = useAuth()

  const [name, setName] = useState(user?.displayName || '')

  if (user)
    return (
      <Tabs variant="unstyled" h="100%">
        <TabList>
          <Tab>Perfil</Tab>
          <Tab>Histórico</Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="pink.500"
          borderRadius="1px"
        />
        <TabPanels h="100%">
          <TabPanel h="100%">
            <ProfilePanel user={user} />
          </TabPanel>
          <TabPanel h="100%">
            <Center h="100%">
              <Text fontSize="20px" fontWeight="500" textAlign="center">
                Aguarde, em breve terá algo aqui!
              </Text>
            </Center>
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
