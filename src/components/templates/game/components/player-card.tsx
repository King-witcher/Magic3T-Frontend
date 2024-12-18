import { useGame } from '@/contexts/game.context.tsx'
import { useGuardedAuth } from '@/contexts/guarded-auth.context.tsx'
import { useRankInfo } from '@/hooks/useRanks'
import {
  Badge,
  Center,
  Flex,
  Image,
  Stack,
  Text,
  keyframes,
  Avatar,
  type CenterProps,
} from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { SmoothNumber } from '@/components/atoms'
import { getAcrylicProps } from '@/utils/style-helpers'
import { getIconUrl } from '@/utils/utils'
import { UserAvatar } from '@/components/molecules'

interface Props extends CenterProps {
  player: 'current' | 'opponent'
}

const appear = keyframes`
  from {
    opacity: 0;
  } to {
    opacity: 1;
  }
`

export function PlayerCard({ player, ...rest }: Props) {
  const { user } = useGuardedAuth()
  const { getRankInfo } = useRankInfo()

  const { isActive, opponentProfile, ratingsVariation } = useGame()

  const currentPlayer = player === 'current'

  const profile = currentPlayer ? user : opponentProfile
  const rinfo = profile && getRankInfo(profile.glicko)

  const ratingVariation =
    ratingsVariation?.[currentPlayer ? 'player' : 'opponent']

  const integerVariation =
    ratingVariation && Math.round(Math.abs(ratingVariation))

  if (!isActive) return null

  return (
    <Center
      as={Link}
      to={`/user/${profile?._id}`}
      className="playerCard"
      alignItems="center"
      justifyContent="left"
      gap="20px"
      p="20px"
      // overflow="hidden"
      w="400px"
      transition="background-color 200ms"
      _hover={{
        backgroundColor: '#ffffff40',
      }}
      {...getAcrylicProps()}
      {...rest}
    >
      {/* <Avatar
        src={getIconUrl(profile?.summoner_icon)}
        size="lg"
        border="1px solid #ffffff40"
      /> */}
      <UserAvatar
        icon={profile?.summoner_icon || 0}
        wing={rinfo?.wing || ''}
        division={rinfo?.division || 1}
        m="10px 30px"
        size={70}
      />
      {/* <Image src={rinfo?.wing} /> */}
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
                {profile.identification?.nickname}
              </Text>
            </Flex>
            <Flex alignItems="center" gap="5px">
              <Image src={rinfo?.emblem} w="32px" />

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
