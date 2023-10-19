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
import ProfileTab from './tabs/ProfileTab'
import HistoryTab from './tabs/HistoryTab'
import SignInPage from '@/components/SignInPage'

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) return <SignInPage />

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
          <ProfileTab user={user} />
        </TabPanel>
        <TabPanel>
          <HistoryTab user={user} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
