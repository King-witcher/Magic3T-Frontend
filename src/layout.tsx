import { Box, Stack } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { useServiceStatus } from './contexts/ServiceStatusContext'
import { ServicesOffline } from './pages/services-offline'
import Navbar from './components/Navbar'

export default function Layout() {
  return (
    <Stack alignItems="center" h="100dvh" gap="0">
      <Navbar />
      <Box flex="1" boxSizing="border-box" padding="10px" w="100%">
        <Box pos="relative" rounded="10px" h="100%" bg="white" p="10px">
          <Outlet />
        </Box>
      </Box>
    </Stack>
  )
}
