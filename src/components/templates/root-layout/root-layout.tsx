import { Box, Flex, Stack } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { Credits, LayoutPanel, Navbar } from './components'
import { PageWidthLimiter } from '@/components/atoms'

interface Props {
  children: ReactNode
}

export function RootLayout({ children }: Props) {
  return (
    <Stack
      className="root-layout"
      alignItems="center"
      h="100dvh"
      gap="0"
      pos="relative"
    >
      <Box
        w="full"
        rounded={999999}
        bg="radial-gradient(white, transparent 70.7%)"
        mixBlendMode="overlay"
        aspectRatio={1}
        pos="fixed"
        left="50%"
        top="50%"
        zIndex={0}
        transform="translate(-50%, -50%)"
      />
      <Navbar />
      <Flex flex="1" w="full" justify="center" h="fit-content" zIndex={1}>
        <PageWidthLimiter>{children}</PageWidthLimiter>
      </Flex>
    </Stack>
  )
}
