import { useServiceStatus } from '@/contexts/ServiceStatusContext'
import { useRankInfo } from '@/hooks/useRanks'
import { UserData } from '@/models/users/User'
import { Avatar, Flex, Text, Image, VStack } from '@chakra-ui/react'

interface Props {
  user: UserData
}

const tierMap = {
  Unranked: 'Indefinido',
  Bronze: 'Bronze',
  Silver: 'Prata',
  Gold: 'Ouro',
  Diamond: 'Diamante',
  Elite: 'Elite',
}

const divisionMap = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
}

export default function Profile({ user }: Props) {
  const { getRankInfo } = useRankInfo()
  const rinfo = getRankInfo(user.glicko)

  return (
    <VStack gap="0">
      <Avatar
        src={user.photoURL || undefined}
        size={'xl'}
        rounded="20px"
        borderWidth="6px"
        borderColor={rinfo.colorScheme.darker}
        overflow="hidden"
        _before={{
          content: '""',
          inset: 0,
          pos: 'absolute',
        }}
        sx={{
          '--bg': rinfo ? 'colors.' + rinfo.colorScheme.lighter : 'white',
          '& img': {
            rounded: '14px',
            bg: 'linear-gradient(white, var(--bg))',
          },
        }}
      />
      <Flex alignItems="center" gap="8px">
        <Text fontSize="30px">{user.nickname}</Text>
      </Flex>
      <Flex alignItems="center" userSelect="none" gap="5px">
        <Text
          color={rinfo.colorScheme.darker}
          fontSize="18px"
          fontWeight="700"
        >{`${tierMap[rinfo.tier]} ${
          rinfo.tier === 'Elite' || rinfo.tier === 'Unranked'
            ? ''
            : divisionMap[rinfo.division]
        }`}</Text>
        <Image
          ml="3px"
          src={rinfo?.thumbnail}
          alt="rank"
          draggable={false}
          w="32px"
        />
        <Text fontSize="16px" fontWeight="700" color="gray.600">
          {
            <>
              {rinfo?.rating}
              {rinfo?.precise && '!'}
              {!rinfo?.reliable && '?'} SR
            </>
          }
        </Text>
        <Text fontSize="12px" fontWeight="500" color="gray.600">
          ±{rinfo?.deviation}
        </Text>
      </Flex>
    </VStack>
  )
}
