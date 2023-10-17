import { Box, Stack, Text } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'

export default function Layout() {
  return (
    <Stack alignItems="center" h="100dvh" gap="0">
      <Navbar />
      <Box flex="1" boxSizing="border-box" padding="10px" w="100%" gap="10px">
        <Box
          pos="relative"
          rounded="10px"
          h="100%"
          bg="white"
          p="10px"
          overflow="hidden"
        >
          <Outlet />
          <Stack
            position="absolute"
            bottom="8px"
            right="8px"
            gap="0"
            alignItems="flex-end"
          >
            <Text fontSize="11px" color="blackAlpha.100">
              Powered by Giuseppe Lanna
            </Text>
            <Text fontSize="11px" color="blackAlpha.200">
              Motivated by you
            </Text>
          </Stack>
        </Box>
      </Box>
    </Stack>
  )
}
