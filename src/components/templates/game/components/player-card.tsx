import { SmoothNumber } from '@/components/atoms'
import { UserAvatar } from '@/components/molecules'
import { useGame } from '@/contexts/game.context.tsx'
import { useGuardedAuth } from '@/contexts/guarded-auth.context.tsx'
import { Tier, divisionMap, useRatingInfo } from '@/hooks/use-rating-info'
import { tiersMap } from '@/utils/ranks'
import { getAcrylicProps } from '@/utils/style-helpers'
import {
  Badge,
  Center,
  type CenterProps,
  Flex,
  Image,
  Stack,
  Text,
  keyframes,
} from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'

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
  const { getRankInfo } = useRatingInfo()

  const { isActive, opponentProfile, ratingsVariation } = useGame()

  const currentPlayer = player === 'current'

  const profile = currentPlayer ? user : opponentProfile
  const rinfo = profile && getRankInfo(profile.glicko)
  const tierInfo = rinfo?.tier ? tiersMap[rinfo.tier] : null

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
      w="400px"
      transition="background-color 200ms"
      _hover={{
        backgroundColor: '#ffffff40',
      }}
      {...getAcrylicProps()}
      {...rest}
    >
      <UserAvatar
        icon={profile?.summoner_icon || 0}
        tier={rinfo?.tier || Tier.Provisional}
        division={rinfo?.division}
        m="10px 30px"
        size={70}
      />
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
              <Image src={tierInfo?.emblem} w="34px" />
              <Text textTransform="capitalize" fontSize="0.875rem">
                {rinfo?.tier} {divisionMap[rinfo?.division || 0]}
              </Text>
              {rinfo?.reliable && (
                <Text fontWeight={300} fontSize="0.875rem">
                  - <SmoothNumber value={rinfo?.leaguePoints || 0} /> LP
                  {!rinfo!.reliable && '?'}
                  {rinfo!.precise && '!'}
                </Text>
              )}

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
