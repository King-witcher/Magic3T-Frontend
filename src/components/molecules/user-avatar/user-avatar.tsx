import { getIconUrl } from '@/utils/utils'
import { Box, Center, Image, type BoxProps } from '@chakra-ui/react'

interface Props extends BoxProps {
  size: number
  icon: number
  wing: string
}

export function UserAvatar({ icon, wing, size, ...rest }: Props) {
  return (
    <Center
    // p={`${(1.4 * size) / 2}px ${(1.4 * size) / 2}px ${(0.6 * size) / 2}px ${(1.4 * size) / 2}px`}
    >
      <Center pos="relative" {...rest} boxSize={`${size}px`}>
        <Image
          src={getIconUrl(icon)}
          pos="absolute"
          inset="0"
          top="0"
          rounded="999"
        />
        <Box pos="absolute" w="290%" bottom="-100%">
          <Image src={wing} />
        </Box>
      </Center>
    </Center>
  )
}
