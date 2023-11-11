import { models } from '@/models'
import { UserData } from '@/models/users/User'
import { getEloUrl } from '@/utils/getEloUrl'
import {
  Avatar,
  Center,
  Flex,
  Text,
  VStack,
  Image,
  Tooltip,
} from '@chakra-ui/react'
import { User } from 'firebase/auth'
import { useEffect, useState } from 'react'

interface Props {
  user: User
}

export default function ProfileTab({ user }: Props) {
  const [profile, setProfile] = useState<UserData | null>(null)

  useEffect(() => {
    load()
    async function load() {
      setProfile(await models.users.getbyId(user.uid))
    }
  }, [])

  return (
    <Center h="100%">
      <VStack
        gap="5px"
        h="100%"
        w={{
          base: '100%',
          md: '400px',
        }}
        justifyContent="center"
      >
        <Avatar
          size="xl"
          src={user.photoURL || undefined}
          boxShadow="0 0 20px 10px #00000020"
        />
        <Text fontSize="30px">{user.displayName}</Text>
        <Flex alignItems="center" userSelect="none" gap="6px">
          <Text fontSize="18px" fontWeight="600">
            Rating:
          </Text>
          {profile && (
            <Tooltip label="Rating">
              <Image
                ml="3px"
                src={getEloUrl(profile.glicko.rating)}
                alt="rank"
                draggable={false}
              />
            </Tooltip>
          )}
          <Text fontSize="18px" fontWeight="500" color="gray.500">
            {profile &&
              `${profile.glicko.rating.toFixed()} (±${(
                2 * profile.glicko.deviation
              ).toFixed()}) SR`}
          </Text>
        </Flex>
      </VStack>
    </Center>
  )
}
