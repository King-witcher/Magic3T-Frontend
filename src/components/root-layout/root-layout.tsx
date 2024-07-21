import { Flex, Stack } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { Credits, LayoutPanel, Navbar } from './components'

interface Props {
  children: ReactNode
}

export function RootLayout({ children }: Props) {
  return (
    <Stack alignItems="center" h="100dvh" gap="0">
      <Navbar />
      <Flex
        flex="1"
        w="full"
        justify="center"
        p="10px"
        h="fit-content"
        gap="10px"
      >
        <LayoutPanel w="full" maxW="1280px" overlay={<Credits />}>
          {children}
        </LayoutPanel>
        {/* <LayoutPanel w="420px">
          <Flex flex="0 0 40px" align="center" justify="center" bg="gray.100">
            Global Ranking
          </Flex>
        </LayoutPanel> */}
      </Flex>
    </Stack>
  )
}
