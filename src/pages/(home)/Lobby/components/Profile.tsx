import { useServiceStatus } from '@/contexts/ServiceStatusContext'
import { useRankInfo } from '@/hooks/useRanks'
import { UserData } from '@/models/users/User'
import { Avatar, Flex, Text, Image, VStack } from '@chakra-ui/react'

interface Props {
  user: UserData
}

export default function Profile({ user }: Props) {
  const { getRankInfo } = useRankInfo()
  const rinfo = getRankInfo(user.glicko)

  return (
    <VStack gap="0">
      <Avatar
        src={user?.photoURL || undefined}
        size={'xl'}
        boxShadow="0 0 20px 10px #00000020"
      />
      <Text fontSize="30px">{user?.nickname}</Text>
      <Flex alignItems="center" gap="5px" color="gray.600">
        <Image
          ml="3px"
          src={rinfo.thumbnail}
          alt="rank"
          draggable={false}
          w="32px"
        />
        <Text fontSize="18px" fontWeight={700}>
          {rinfo.rating}
          {!rinfo.reliable && '?'}
          {rinfo.precise && '!'}{' '}
        </Text>
        <Text fontSize="14px" fontWeight={500}>
          ±{rinfo.deviation}
        </Text>
      </Flex>
    </VStack>
  )
}
