import { PageWidthLimiter } from '@/components/atoms'
import { Navbar } from '@/components/organisms'
import { Box } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { ModalLayout } from './modal-layout'

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
      <div className="root-layout flex flex-col items-center h-dvh relative">
        <Navbar />
        <div className="flex flex-[1] w-full justify-center h-fit overflow-x-hidden overflow-y-scroll">
          <PageWidthLimiter>{children}</PageWidthLimiter>
        </div>
      </div>
      <ModalLayout />
    </>
  )
}
