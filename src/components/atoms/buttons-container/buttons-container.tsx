import { getAcrylicProps } from '@/utils/style-helpers'
import { Box, Stack, type StackProps } from '@chakra-ui/react'
import type { ReactNode } from '@tanstack/react-router'

interface Props extends StackProps {
  children: ReactNode
}

export function ButtonsContainer({ children, ...rest }: Props) {
  return (
    <Stack
      gap="0"
      {...getAcrylicProps()}
      background="unset"
      rounded="16px"
      overflow="hidden"
      flexDirection={{ base: 'column', sm: 'row' }}
      w="full"
      direction={{ base: 'column', sm: 'row' }}
      spacing={0}
      divider={
        <Box bg="#ffffff80" alignSelf="stretch" border="none" flex="0 0 1px" />
      }
      {...rest}
    >
      {children}
    </Stack>
  )
}
