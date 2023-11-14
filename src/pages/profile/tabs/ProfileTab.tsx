import { useAuth } from '@/contexts/AuthContext'
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
import { useEffect, useState } from 'react'

interface Props {
  user: UserData
}

export default function ProfileTab({ user }: Props) {
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
        <Flex alignItems="center" userSelect="none" gap="6px">
          <Text fontSize="18px" fontWeight="600">
            Rating:
          </Text>
          {user && (
            <Tooltip label="Rating">
              <Image
                ml="3px"
                src={getEloUrl(user.glicko.rating)}
                alt="rank"
                draggable={false}
              />
            </Tooltip>
          )}
          <Text fontSize="18px" fontWeight="500" color="gray.500">
            {user &&
              `${user.glicko.rating.toFixed()} (±${(
                2 * user.glicko.deviation
              ).toFixed()}) SR`}
          </Text>
        </Flex>
      </VStack>
    </Center>
  )
}
