import { Division, League } from '@/services/nest-api'
import { leaguesMap } from '@/utils/ranks'
import { getIconUrl } from '@/utils/utils'
import { Box, type BoxProps, Center, Image, Text } from '@chakra-ui/react'
import { RiEdit2Fill } from 'react-icons/ri'

interface Props extends BoxProps {
  size: number
  icon: number
  league: League
  division: Division | null
  showPencil?: boolean
}

const numbers = ['', 'I', 'II', 'III', 'IV', 'V']

export function UserAvatar({
  icon,
  size,
  league,
  division,
  showPencil,
  ...rest
}: Props) {
  const tierInfo = leaguesMap[league]

  return (
    <Center
    // p={`${(1.4 * size) / 2}px ${(1.4 * size) / 2}px ${(0.6 * size) / 2}px ${(1.4 * size) / 2}px`}
    >
      <Center
        pos="relative"
        {...rest}
        boxSize={`${size}px`}
        _hover={{
          '& > .edit-button': {
            bg: 'white',
            color: 'black',
          },
        }}
      >
        <Image
          src={getIconUrl(icon)}
          boxShadow={
            league === League.Provisional
              ? '0 0 0 6px #bbb, 0 5px 15px 5px #00000080'
              : undefined
          }
          boxSizing="content-box"
          pos="absolute"
          boxSize="100%"
          top="0"
          rounded="999"
        />
        <Box pos="absolute" w="290%" bottom="-100%" pointerEvents="none">
          <Image src={tierInfo.wing} />
        </Box>
        {division && (
          <Text
            pos="absolute"
            fontSize={`${size * 0.16}px`}
            lineHeight={`${size * 0.16}px`}
            top="-10%"
          >
            {numbers[division]}
          </Text>
        )}
        {showPencil && (
          <Center
            className="edit-button"
            pos="absolute"
            bg="#ffffff40"
            p="4px"
            rounded="999"
            color="white"
            right="15%"
            top="15%"
            transition="200ms all"
          >
            <RiEdit2Fill />
          </Center>
        )}
      </Center>
    </Center>
  )
}
