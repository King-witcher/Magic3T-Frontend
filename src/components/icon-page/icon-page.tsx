import { Flex, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import type { IconType } from 'react-icons'

interface Props {
  Icon: IconType
  children: ReactNode
}

export function IconPage({ Icon, children }: Props) {
  return (
    <Flex h="full" align="center" justify="center" gap="10px" flexDir="column">
      <Icon size="140px" />
      <Text size="20px" align="center">
        {children}
      </Text>
    </Flex>
  )
}
