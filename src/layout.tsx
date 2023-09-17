import { Box, Flex, Link, Stack, Tag } from '@chakra-ui/react'
import { Outlet, Link as RouterLink } from 'react-router-dom'

export default function Layout() {
  return (
    <Stack alignItems="center" h="100dvh" gap="0">
      <Flex
        as="header"
        h="55px"
        w="100%"
        alignItems="center"
        px="10px"
        bg="pink.600"
        color="white"
      >
        <Link
          as={RouterLink}
          href="/"
          p="10px"
          rounded="10px"
          userSelect="none"
          cursor="pointer"
          _hover={{ bg: 'whiteAlpha.200' }}
        >
          Magic3t V2 <Tag ml="0.5rem">alpha</Tag>
        </Link>
      </Flex>
      <Box flex="1" boxSizing="border-box" padding="10px" w="100%">
        <Box pos="relative" rounded="10px" h="100%" bg="white" p="10px">
          <Outlet />
        </Box>
      </Box>
    </Stack>
  )
}
