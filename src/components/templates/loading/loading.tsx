import { Spinner, Stack, Text } from '@chakra-ui/react'

export function Loading() {
  return (
    <Stack h="full" w="full" align="center" justify="center">
      <Spinner size="xl" thickness="5px" color="light" speed="666ms" />
      <Text>Loading...</Text>
    </Stack>
  )
}
