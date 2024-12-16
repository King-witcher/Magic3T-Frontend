import { useGame } from '@/contexts/game.context.tsx'
import { useGuardedAuth } from '@/contexts/guarded-auth.context.tsx'
import { useRankInfo } from '@/hooks/useRanks'
import { GameStatus } from '@/types/game.ts'
import {
  Badge,
  Center,
  Flex,
  Image,
  Stack,
  Text,
  keyframes,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  Avatar,
} from '@chakra-ui/react'
import type { RefObject } from 'react'
import { ChatDrawer, ForfeitModal } from '.'
import { Link } from '@tanstack/react-router'
import { SmoothNumber } from '@/components/atoms'

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

export function PlayerCard({ player, chatInputRef }: Props) {
  const { user } = useGuardedAuth()
  const { getRankInfo } = useRankInfo()

  const {
    isOpen: forfeitModaOpen,
    onClose: closeForfeitModal,
    onOpen: openForfeitModal,
  } = useDisclosure()

  const { matchId, isActive, gameStatus, opponentProfile, ratingsVariation } =
    useGame()

  const currentPlayer = player === 'current'

  const {
    isOpen: chatIsOpen,
    onClose: chatOnClose,
    onOpen: chatOnOpen,
  } = useDisclosure()

  const profile = currentPlayer ? user : opponentProfile
  const rinfo = profile && getRankInfo(profile.glicko)

  const ratingVariation =
    ratingsVariation?.[currentPlayer ? 'player' : 'opponent']

  const integerVariation =
    ratingVariation && Math.round(Math.abs(ratingVariation))

  if (!isActive) return null

  return (
    <Center
      className="playerCard"
      alignItems="center"
      justifyContent="left"
      gap="20px"
      border="solid 1px #ffffff40"
      p="20px"
      rounded="10px"
      overflow="hidden"
      bg="#ffffff30"
      boxShadow="0 0 10px 0 #00000040"
      w="400px"
    >
      <Avatar src={profile?.photoURL} size="lg" border="1px solid #ffffff40" />
      <Stack gap="0">
        {profile && (
          <>
            <Flex alignItems="center" gap="5px">
              {profile.role === 'bot' && (
                <Badge
                  rounded="5px"
                  fontSize="12px"
                  bg="#ffffff20"
                  color="light"
                >
                  Bot
                </Badge>
              )}
              <Text
                fontSize="20px"
                fontWeight={400}
                noOfLines={1}
                color="light"
              >
                {profile.nickname}
              </Text>
            </Flex>
            <Flex alignItems="center" gap="5px">
              <Image src={rinfo?.thumbnail} w="32px" />

              <Text fontWeight={300} fontSize="16px" color="light">
                <SmoothNumber value={rinfo!.rating} />
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
  )
}
