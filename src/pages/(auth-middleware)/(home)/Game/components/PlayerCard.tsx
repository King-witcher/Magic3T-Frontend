import {
  Flex,
  Text,
  Center,
  Stack,
  Image,
  Badge,
  keyframes,
} from '@chakra-ui/react'
import { useGame } from '@/contexts/GameContext'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react'
import { RefObject } from 'react'
import ForfeitModal from './ForfeitModal'
import { GameStatus } from '@/types/game.ts'
import { Avatar } from '@chakra-ui/react'
import ChatDrawer from './ChatDrawer'
import { Link } from 'react-router-dom'
import { useRankInfo } from '@/hooks/useRanks'
import SmoothNumber from '@/components/SmoothNumber'
import { useGuardedAuth } from '@/contexts/GuardedAuthContext'

interface Props {
  player: 'current' | 'opponent'
  chatInputRef: RefObject<HTMLInputElement>
}

const appear = keyframes`
  from {
    opacity: 0;
  } to {
    opacity: 1;
  }
`

export default function PlayerCard({ player, chatInputRef }: Props) {
  const { user } = useGuardedAuth()
  const { getRankInfo } = useRankInfo()

  const {
    isOpen: forfeitModaOpen,
    onClose: closeForfeitModal,
    onOpen: openForfeitModal,
  } = useDisclosure()

  const easterEgg =
    user._id === 'Yrh2QzILK5XWAVitOMj42NSHySJ3'
      ? 'não é burmor, é morbur c:'
      : user.nickname.includes('Marileia Almeida')
      ? 'Te amo, mãe <3'
      : ''

  const { matchId, isActive, gameStatus, oponentProfile, ratingsVariation } =
    useGame()

  const currentPlayer = player === 'current'

  const {
    isOpen: chatIsOpen,
    onClose: chatOnClose,
    onOpen: chatOnOpen,
  } = useDisclosure()

  const profile = currentPlayer ? user : oponentProfile
  const rinfo = profile && getRankInfo(profile.glicko)

  const ratingVariation =
    ratingsVariation && ratingsVariation[currentPlayer ? 'player' : 'oponent']

  const integerVariation =
    ratingVariation && Math.round(Math.abs(ratingVariation))

  if (!isActive) return null

  return (
    <Menu>
      <ChatDrawer
        isOpen={chatIsOpen}
        onClose={chatOnClose}
        size="xs"
        placement="right"
      />
      <MenuButton
        as={Link}
        to={currentPlayer ? '.' : `/user/${profile?._id}`}
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
          borderWidth={rinfo?.reliable ? '1px 1px 1px 6px' : '1px'}
          borderColor={rinfo?.reliable ? rinfo.colorScheme.darker : 'gray.400'}
          p={rinfo?.reliable ? '10px 10px 10px 5px' : '10px'}
          rounded="10px"
          overflow="hidden"
          bg={rinfo?.reliable ? rinfo.colorScheme.normal : 'transparent'}
          transition="background 2s linear, border-color 2s linear"
          w="250px"
          _hover={
            rinfo
              ? {
                  bg: rinfo.colorScheme.lighter,
                }
              : {}
          }
        >
          <Avatar src={profile?.photoURL} size="lg" />
          <Stack gap="0">
            {profile && (
              <>
                <Flex alignItems="center" gap="5px">
                  {profile.role === 'bot' && (
                    <Badge rounded="5px" fontSize="12px" bg="blackAlpha.200">
                      Bot
                    </Badge>
                  )}
                  <Text fontSize="20px" fontWeight={700} noOfLines={1}>
                    {profile.nickname}
                  </Text>
                </Flex>
                <Flex alignItems="center" gap="5px">
                  <Image src={rinfo?.thumbnail} w="32px" />

                  <Text fontWeight={600} fontSize="16px">
                    {<SmoothNumber value={rinfo!.rating} />}
                    {!rinfo!.reliable && '?'}
                    {rinfo!.precise && '!'}
                  </Text>
                  {!!ratingVariation && (
                    <Text
                      animation={`${appear} linear 300ms`}
                      fontWeight={800}
                      fontSize="14px"
                      color={
                        ratingVariation < 0
                          ? 'red.500'
                          : ratingVariation > 0
                          ? 'green.500'
                          : 'gray.500'
                      }
                    >
                      {ratingVariation < 0 ? '-' : '+'}
                      {integerVariation}
                    </Text>
                  )}
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
        {(gameStatus === GameStatus.Defeat ||
          gameStatus === GameStatus.Draw ||
          gameStatus === GameStatus.Victory) && (
          <Link to={`/me/history/${matchId}`}>
            <MenuItem display={{ base: 'none', lg: 'block' }}>
              Ver no histórico
            </MenuItem>
          </Link>
        )}
        <MenuItem
          hidden={gameStatus !== GameStatus.Playing}
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
