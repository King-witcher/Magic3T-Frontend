import { Text, VStack } from '@chakra-ui/react'
import { GiBrokenArrow } from 'react-icons/gi'

export function NotFoundTemplate() {
  return (
    <VStack h="100%" justifyContent="center">
      <GiBrokenArrow size="36px" />
      <Text fontSize="20px">Página não encontrada</Text>
    </VStack>
  )
}
