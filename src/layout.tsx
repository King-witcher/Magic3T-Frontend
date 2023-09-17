import { Box, Flex, Stack, Tag } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <Stack alignItems="center" h="100dvh" gap="0">
      <Flex
        as="header"
        h="50px"
        w="100%"
        alignItems="center"
        px="20px"
        bg="pink.600"
        color="white"
      >
        Magic3t V2 <Tag ml="0.5rem">alpha</Tag>
      </Flex>
      <Box flex="1" boxSizing="border-box" padding="10px" w="100%">
        <Box pos="relative" rounded="10px" h="100%" bg="white" p="10px">
          <Outlet />
        </Box>
      </Box>
    </Stack>
  )
}
