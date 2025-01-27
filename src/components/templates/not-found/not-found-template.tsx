import { Text, VStack } from '@chakra-ui/react'
import { GiBrokenArrow } from 'react-icons/gi'

export function NotFoundTemplate() {
  return (
    <VStack h="100%" justifyContent="center">
      <GiBrokenArrow size="48px" />
      <Text fontSize="1.25rem">Not found</Text>
    </VStack>
  )
}
