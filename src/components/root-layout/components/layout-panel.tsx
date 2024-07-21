import { Box, type BoxProps } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface Props extends BoxProps {
  overlay?: ReactNode
}

export function LayoutPanel({ children, overlay, ...props }: Props) {
  return (
    <Box
      pos="relative"
      overflow="hidden"
      h="full"
      rounded="10px"
      bg="gray.200"
      shadow="0 0 10px 0 #00000040"
      {...props}
    >
      <Box pos="absolute" inset={0} overflow="auto">
        {children}
      </Box>
      {overlay}
    </Box>
  )
}
