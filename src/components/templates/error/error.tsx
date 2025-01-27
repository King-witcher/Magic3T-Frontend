import { Link, Stack, Text } from '@chakra-ui/react'
import { Link as TanStackLink } from '@tanstack/react-router'
import { MdDangerous } from 'react-icons/md'

export function ErrorTemplate() {
  return (
    <Stack
      bg="#203040"
      color="white"
      h="100dvh"
      w="100dvw"
      top="0"
      left="0"
      pos="absolute"
      align="center"
      justify="center"
      spacing="0"
    >
      <MdDangerous color="#ff4060" size="240px" />
      <Text fontSize="1.25rem" align="center" fontFamily="sans-serif">
        A runtime error prevented Magic3T from displaying this page.
      </Text>
      <Link
        as={TanStackLink}
        to="/"
        fontSize="1.25rem"
        fontFamily="sans-serif"
        fontWeight={700}
        color="#44abff"
        _visited={{
          color: '#44abff',
        }}
      >
        Go back to home page
      </Link>
    </Stack>
  )
}
