import { Box, Flex, Stack } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { Credits, LayoutPanel, Navbar } from './components'

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
      bg="#332455"
      // bg="#450b5c"
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
      <Flex
        flex="1"
        w="full"
        justify="center"
        p="10px"
        h="fit-content"
        gap="10px"
      >
        {/* <LayoutPanel w="full" maxW="1280px" overlay={<Credits />}> */}
        {children}
        {/* </LayoutPanel> */}
        {/* <LayoutPanel w="420px">
          <Flex flex="0 0 40px" align="center" justify="center" bg="gray.100">
            Global Ranking
          </Flex>
        </LayoutPanel> */}
      </Flex>
    </Stack>
  )
}
