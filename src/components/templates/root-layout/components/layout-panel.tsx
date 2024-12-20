import { Box, type BoxProps } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface Props extends BoxProps {
  overlay?: ReactNode
}

export function LayoutPanel({ children, overlay, ...props }: Props) {
  return (
    <Box
      className="layout-panel"
      pos="relative"
      overflow="hidden"
      h="full"
      rounded="10px"
      bg="#ffffff30"
      shadow="0 0 10px 0 #00000040"
      border="solid 1px #ffffff80"
      {...props}
    >
      <Box pos="absolute" inset={0} overflow="hidden scroll">
        {children}
      </Box>
      {overlay}
    </Box>
  )
}
