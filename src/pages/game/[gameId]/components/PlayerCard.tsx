import { Flex, Text, Center, Stack, Image } from '@chakra-ui/react'
import { useGame } from '@/contexts/GameContext'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react'
import { RefObject, useRef, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ForfeitModal from './ForfeitModal'
import { GameStatus } from '@/types/types'
import { Avatar } from '@chakra-ui/react'
import { getRatingInfo } from '@/utils/getEloUrl'
import ChatDrawer from './ChatDrawer'

interface Props {
  player: 'current' | 'opponent'
  chatInputRef: RefObject<HTMLInputElement>
}

export default function PlayerCard({ player, chatInputRef }: Props) {
  const { user } = useAuth()

  const easterEgg =
    user?._id === 'Yrh2QzILK5XWAVitOMj42NSHySJ3'
      ? 'não é burmor, é morbur c:'
      : user?.nickname?.includes('Marileia Almeida')
      ? 'Te amo, mãe <3'
      : ''

  const {
    isOpen: forfeitModaOpen,
    onClose: closeForfeitModal,
    onOpen: openForfeitModal,
  } = useDisclosure()

  const { gameState, oponentProfile } = useGame()

  const currentPlayer = player === 'current'

  const {
    isOpen: chatIsOpen,
    onClose: chatOnClose,
    onOpen: chatOnOpen,
  } = useDisclosure()

  const profile = currentPlayer ? user : oponentProfile
  const rating = profile && getRatingInfo(profile.glicko)

  if (!gameState) return null

  return (
    <Menu>
      <ChatDrawer
        isOpen={chatIsOpen}
        onClose={chatOnClose}
        size="xs"
        placement="right"
      />
      <MenuButton
        disabled={!currentPlayer}
        cursor={currentPlayer ? 'pointer' : 'auto'}
        sx={
          currentPlayer
            ? {
                '&:hover .playerCard': {
                  bg: 'gray.50',
                },
              }
            : {}
        }
      >
        <Center
          className="playerCard"
          alignItems="center"
          justifyContent="left"
          gap="10px"
          border="solid 1px #ddd"
          p="10px"
          rounded="10px"
          overflow="hidden"
          transition="background 80ms linear"
          w="250px"
        >
          <Avatar src={profile?.photoURL} size="lg" />
          <Stack gap="0">
            {profile && (
              <>
                <Text fontSize="20px" fontWeight={700} noOfLines={1}>
                  {profile.nickname}
                </Text>
                <Flex alignItems="center" gap="5px">
                  <Image src={rating?.thumbnail} w="25px" />
                  <Text fontSize="16px">
                    {rating!.rating}
                    {(rating!.deviation || 200) > 100 && '*'} SR
                  </Text>
                </Flex>
              </>
            )}
          </Stack>
        </Center>
      </MenuButton>
      <MenuList>
        <MenuItem display={{ base: 'block', lg: 'none' }} onClick={chatOnOpen}>
          Enviar mensagem
        </MenuItem>
        <MenuItem
          display={{ base: 'none', lg: 'block' }}
          onClick={() => {
            if (chatInputRef.current) chatInputRef.current.focus()
          }}
        >
          Enviar mensagem
        </MenuItem>
        <MenuItem
          hidden={gameState.gameStatus !== GameStatus.Playing}
          bg="red.200"
          _hover={{
            bg: 'red.400',
          }}
          onClick={openForfeitModal}
        >
          Render-se
          <ForfeitModal onClose={closeForfeitModal} isOpen={forfeitModaOpen} />
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
