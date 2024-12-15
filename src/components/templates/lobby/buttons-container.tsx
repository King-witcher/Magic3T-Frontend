import { Box, Stack, type StackProps } from '@chakra-ui/react'
import type { ReactNode } from '@tanstack/react-router'

interface Props extends StackProps {
  children: ReactNode
}

export function ButtonsContainer({ children, ...rest }: Props) {
  return (
    <Stack
      gap="0"
      rounded="16px"
      overflow="hidden"
      flexDirection={{ base: 'column', sm: 'row' }}
      border="solid 1px #ffffff40"
      boxShadow="0 0 10px 0 #00000020"
      w="full"
      direction={{ base: 'column', sm: 'row' }}
      spacing={0}
      divider={
        <Box bg="#ffffff40" alignSelf="stretch" border="none" flex="0 0 1px" />
      }
      {...rest}
    >
      {children}
    </Stack>
  )
}
