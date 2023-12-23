import { UserData } from '@/models/users/User'
import { getEloUrl, getRatingInfo } from '@/utils/getEloUrl'
import { Avatar, Flex, Text, Image, VStack } from '@chakra-ui/react'

interface Props {
  user: UserData
}

export default function Profile({ user }: Props) {
  const rinfo = getRatingInfo(user.glicko)

  return (
    <VStack gap="0">
      <Avatar src={user?.photoURL || undefined} size={'xl'} />
      <Text fontSize="22px">{user?.nickname}</Text>
      <Flex alignItems="center" gap="5px">
        <Image ml="3px" src={rinfo.thumbnail} alt="rank" draggable={false} />
        <Text>
          {rinfo.rating} (±{rinfo.deviation}) SR
        </Text>
      </Flex>
    </VStack>
  )
}
