import { Box, Flex } from '@chakra-ui/react'
import type { ReactNode } from '@tanstack/react-router'

interface Props {
  children: ReactNode
}

export function PageWidthLimiter({ children }: Props) {
  return (
    <Flex p={{ base: '30px', sm: '40px 100px' }} w="full" justify="center">
      <Box w="full" maxW="1400px">
        {children}
      </Box>
    </Flex>
  )
}
