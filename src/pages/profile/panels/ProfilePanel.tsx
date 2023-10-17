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
import { AiFillEdit } from 'react-icons/ai'

interface Props {
  user: User
}

export default function ProfilePanel({ user }: Props) {
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
          size="xxl"
          src={user.photoURL || ''}
          borderColor="gray.500"
          borderWidth="5px"
        />
        <Text fontSize="30px">{user.displayName}</Text>
        <Flex alignItems="center" userSelect="none">
          <Text fontSize="18px" fontWeight="600">
            Rating:
          </Text>
          <Tooltip label="Prata V">
            <Image
              ml="3px"
              src="https://quake-stats.bethesda.net/ranks/Silver_05.png"
              alt="rank"
              draggable={false}
            />
          </Tooltip>
          <Text fontSize="18px" fontWeight="500" color="gray.500">
            1500 SR
          </Text>
        </Flex>
      </VStack>
    </Center>
  )
}
