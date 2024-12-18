import { getIconUrl } from '@/utils/utils'
import { Box, Center, Image, Text, type BoxProps } from '@chakra-ui/react'

interface Props extends BoxProps {
  size: number
  icon: number
  division: number
  wing: string
}

export function UserAvatar({ icon, wing, size, division, ...rest }: Props) {
  return (
    <Center
    // p={`${(1.4 * size) / 2}px ${(1.4 * size) / 2}px ${(0.6 * size) / 2}px ${(1.4 * size) / 2}px`}
    >
      <Center pos="relative" {...rest} boxSize={`${size}px`}>
        <Image
          src={getIconUrl(icon)}
          pos="absolute"
          boxSize="100%"
          top="0"
          rounded="999"
        />
        <Box pos="absolute" w="290%" bottom="-100%">
          <Image src={wing} />
        </Box>
        <Text
          pos="absolute"
          fontSize={`${size * 0.16}px`}
          lineHeight={`${size * 0.16}px`}
          top="-10%"
        >
          {division}
        </Text>
      </Center>
    </Center>
  )
}
