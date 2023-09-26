import {
  Box,
  Button,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tag,
  useDisclosure,
} from '@chakra-ui/react'
import {
  Outlet,
  Link as RouterLink,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { useServiceStatus } from './contexts/ServiceStatusContext'
import { ServicesOffline } from './pages/services-offline'
import { useGame } from './contexts/GameContext'
import { GameStatus } from './types/types'

export default function Layout() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { serverOnline } = useServiceStatus()
  const navigate = useNavigate()
  const { gameStatus } = useGame()

  function handleLogoClick() {
    if (gameStatus === GameStatus.Ongoing) {
      onOpen()
    } else navigate('/')
  }

  function handleModalOkclick() {
    navigate('/')
    onClose()
  }

  return (
    <Stack alignItems="center" h="100dvh" gap="0">
      <Flex
        as="header"
        h="55px"
        w="100%"
        alignItems="center"
        px="10px"
        bg="pink.600"
        color="white"
        gap="10px"
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
      </Flex>
      <Box flex="1" boxSizing="border-box" padding="10px" w="100%">
        <Box pos="relative" rounded="10px" h="100%" bg="white" p="10px">
          {serverOnline ? <Outlet /> : <ServicesOffline />}
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent rounded="10px" padding="20px" minH="200px">
          <ModalHeader m="0" p="0">
            Abandonar partida?
          </ModalHeader>
          <ModalBody p="0" m="0" display="flex" flex="1" alignItems="center">
            Sair da tela de partida será considerado como rendição e você
            perderá a partida atual.
          </ModalBody>
          <ModalFooter gap="10px" m="0" p="0">
            <Button onClick={onClose}>Cancel</Button>
            <Button colorScheme="red" onClick={handleModalOkclick}>
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  )
}
