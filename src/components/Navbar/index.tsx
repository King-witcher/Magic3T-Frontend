import { useAuth } from '@/contexts/AuthContext'
import { useGame } from '@/contexts/GameContext'
import { GameStatus } from '@/types/types'
import { Box, Button, Flex, Tag, useDisclosure } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import LeaveModal from './LeaveModal'

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()
  const { user, signOut, signIn } = useAuth()
  const { gameStatus } = useGame()

  function handleLogoClick() {
    if (gameStatus === GameStatus.Ongoing) {
      onOpen()
    } else navigate('/')
  }

  return (
    <Flex
      as="header"
      h="55px"
      w="100%"
      alignItems="center"
      px="10px"
      bg="pink.600"
      color="white"
      gap="10px"
      justifyContent="space-between"
    >
      <Box
        p="10px"
        rounded="10px"
        userSelect="none"
        cursor="pointer"
        _hover={{ bg: 'whiteAlpha.200' }}
        onClick={handleLogoClick}
      >
        Magic3t V2
        <Tag ml="0.5rem" bgColor="whiteAlpha.400" color="white">
          alpha
        </Tag>
      </Box>
      {user ? (
        <Tag onClick={signOut}>{user.displayName}</Tag>
      ) : (
        <Button onClick={signIn}>Login</Button>
      )}
      <LeaveModal onClose={onClose} isOpen={isOpen} />
    </Flex>
  )
}
