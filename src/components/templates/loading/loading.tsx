import { Spinner } from '@/components/atoms/spinner/spinner'
import { Stack, Text } from '@chakra-ui/react'

export function Loading() {
  return (
    <Stack h="full" w="full" align="center" justify="center">
      <Spinner />
      <Text>Loading...</Text>
    </Stack>
  )
}
