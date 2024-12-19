import { PageWidthLimiter } from '@/components/atoms'
import { Box, Flex, Stack } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { Navbar } from './components'

interface Props {
  children: ReactNode
}

export function RootLayout({ children }: Props) {
  return (
    <>
      <Box
        w="100vw"
        h="100vh"
        rounded={999999}
        bg="radial-gradient(white, transparent 70.7%)"
        mixBlendMode="overlay"
        aspectRatio={1}
        pos="fixed"
        pointerEvents="none"
        left="50%"
        top="50%"
        transform="translate(-50%, -50%)"
      />
      <Stack
        className="root-layout"
        alignItems="center"
        h="100dvh"
        gap="0"
        pos="relative"
      >
        <Navbar />
        <Flex
          flex="1"
          w="full"
          justify="center"
          h="fit-content"
          overflowX="hidden"
          overflowY="scroll"
        >
          <PageWidthLimiter>{children}</PageWidthLimiter>
        </Flex>
      </Stack>
    </>
  )
}
