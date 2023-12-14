import { useAuth } from '@/contexts/AuthContext'
import { models } from '@/models'
import { UserData } from '@/models/users/User'
import { getRatingInfo, getEloUrl } from '@/utils/getEloUrl'
import {
  Avatar,
  Center,
  Flex,
  Text,
  VStack,
  Image,
  Tooltip,
} from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'

interface Props {
  user: UserData
}

export default function ProfileTab({ user }: Props) {
  const rating = useMemo(() => getRatingInfo(user.glicko), [user])

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
        <Text fontSize="30px">{user.nickname}</Text>
        <Flex alignItems="center" userSelect="none" gap="4px">
          <Text fontSize="18px" fontWeight="600">
            Rating:
          </Text>
          {user && (
            <Tooltip label="Rating">
              <Image
                ml="3px"
                src={getRatingInfo(user.glicko).thumbnail}
                alt="rank"
                draggable={false}
              />
            </Tooltip>
          )}
          <Text fontSize="18px" fontWeight="500" color="gray.500">
            {user && `${rating.trustedRating} SR`}
          </Text>
        </Flex>
      </VStack>
    </Center>
  )
}
