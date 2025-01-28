import { SmoothNumber } from '@/components/atoms'
import { UserAvatar } from '@/components/molecules'
import { useGame } from '@/contexts/game.context.tsx'
import { League } from '@/services/nest-api'
import { Team } from '@/types/game-socket'
import { divisionMap, leaguesMap } from '@/utils/ranks'
import { getAcrylicProps } from '@/utils/style-helpers'
import { block } from '@/utils/utils'
import {
  Badge,
  Center,
  type CenterProps,
  Flex,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { Link } from '@tanstack/react-router'

interface Props extends CenterProps {
  team: Team
}

const appear = keyframes`
  from {
    opacity: 0;
  } to {
    opacity: 1;
  }
`

export function PlayerCard({ team, ...rest }: Props) {
  const game = useGame()
  const teamInfo = game.teams[team]
  const profile = teamInfo.profile

  const tierInfo = profile ? leaguesMap[profile?.rating.league] : null

  const gain = block(() => {
    if (teamInfo.gain === null) return null
    const gain = teamInfo.gain
    return Math.round(gain)
  })

  if (!game.isActive) return null

  return (
    <Center
      as={Link}
      to={`/users/${profile?.nickname?.replaceAll(' ', '')}`}
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
        icon={profile?.summonerIcon || 0}
        league={profile?.rating.league || League.Provisional}
        division={profile?.rating.division || null}
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
                {profile.nickname}
              </Text>
            </Flex>
            <Flex alignItems="center" gap="5px">
              <Image src={tierInfo?.emblem} w="34px" />
              <Text textTransform="capitalize" fontSize="0.875rem">
                {profile.rating.league}{' '}
                {divisionMap[profile.rating.division || 0]}
              </Text>
              {profile.rating.league !== League.Provisional && (
                <Text fontWeight={300} fontSize="0.875rem">
                  - <SmoothNumber value={profile.rating.points || 0} /> LP
                  {/* {rinfo!.precise && '!'} */}
                </Text>
              )}

              {gain !== null && (
                <Text
                  animation={`${appear} linear 300ms`}
                  fontWeight={800}
                  fontSize="14px"
                  color={
                    gain < 0 ? 'red.500' : gain > 0 ? 'green.500' : 'gray.500'
                  }
                >
                  {gain >= 0 && '+'}
                  {gain}
                </Text>
              )}
            </Flex>
          </>
        )}
      </Stack>
    </Center>
  )
}
