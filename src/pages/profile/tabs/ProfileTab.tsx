import { models } from '@/models'
import { UserData } from '@/models/users/User'
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

export function getElo(rating: number) {
  if (rating < 400) return 'Bronze_01'
  if (rating < 500) return 'Bronze_02'
  if (rating < 600) return 'Bronze_03'
  if (rating < 700) return 'Bronze_04'
  if (rating < 800) return 'Bronze_05'

  if (rating < 900) return 'Silver_01'
  if (rating < 1000) return 'Silver_02'
  if (rating < 1100) return 'Silver_03'
  if (rating < 1200) return 'Silver_04'
  if (rating < 1300) return 'Silver_05'

  if (rating < 1400) return 'Gold_01'
  if (rating < 1500) return 'Gold_02'
  if (rating < 1600) return 'Gold_03'
  if (rating < 1700) return 'Gold_04'
  if (rating < 1800) return 'Gold_05'

  if (rating < 1900) return 'Diamond_01'
  if (rating < 2000) return 'Diamond_02'
  if (rating < 2100) return 'Diamond_03'
  if (rating < 2200) return 'Diamond_04'
  if (rating < 2300) return 'Diamond_05'

  return 'Elite_01'
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
                src={`https://quake-stats.bethesda.net/ranks/${getElo(
                  profile.rating,
                )}.png`}
                alt="rank"
                draggable={false}
              />
            </Tooltip>
          )}
          <Text fontSize="18px" fontWeight="500" color="gray.500">
            {profile && `${profile.rating.toFixed()} SR`}
          </Text>
        </Flex>
      </VStack>
    </Center>
  )
}
