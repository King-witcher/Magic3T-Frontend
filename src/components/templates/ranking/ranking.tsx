import { useConfig } from '@/contexts/config.context'
import {
  type RatingInfo,
  Tier,
  divisionMap,
  useRatingInfo,
} from '@/hooks/use-rating-info'
import { rankingQueryOptions } from '@/utils/query-options'
import { tiersMap } from '@/utils/ranks'
import { getAcrylicProps } from '@/utils/style-helpers'
import { getIconUrl } from '@/utils/utils'
import { Center, Flex, Heading, Image, Stack } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'

export function RankingTemplate() {
  const rankingQuery = useQuery({
    ...rankingQueryOptions(),
  })

  const { ratingConfig } = useConfig()
  const { getRankInfo } = useRatingInfo()

  const ratingInfoMap = useMemo(() => {
    const map: Record<string, RatingInfo> = {}
    if (rankingQuery.data) {
      for (const user of rankingQuery.data) {
        map[user._id] = getRankInfo(user.glicko)
      }
    }
    return map
  }, [rankingQuery.data, ratingConfig])

  const reorderedUsers = useMemo(() => {
    if (!rankingQuery.data) return []

    const reliable = rankingQuery.data.filter(
      (user) => ratingInfoMap[user._id].reliable
    )

    const provisional = rankingQuery.data
      .filter((user) => !ratingInfoMap[user._id].reliable)
      .sort(
        (a, b) =>
          a.identification?.nickname.localeCompare(
            b.identification?.nickname || ''
          ) || 0
      )

    return [...reliable, ...provisional]
  }, [rankingQuery.data, ratingInfoMap, ratingConfig])

  return (
    <>
      <Heading>Top Magic3T players</Heading>
      <Stack spacing="20px" mt="40px">
        {rankingQuery.isSuccess &&
          reorderedUsers.map((user, index) => {
            const rinfo = ratingInfoMap[user._id]
            const tierInfo = tiersMap[rinfo.tier]

            return (
              <Flex
                as={Link}
                from="/ranking"
                to={`/user/${user._id}`}
                key={user._id}
                align="center"
                p={{ base: '20px 15px', sm: '20px' }}
                gap={{ base: '5px', sm: '10px' }}
                opacity={rinfo.reliable ? 1 : 0.5}
                {...getAcrylicProps()}
                transition="background-color 200ms"
                _hover={{
                  bgColor: '#ffffff40',
                }}
              >
                <Center fontWeight={700} flex="0 0 25px">
                  {rinfo.reliable ? `#${index + 1}` : '-'}
                </Center>{' '}
                <Flex
                  align={'center'}
                  gap="5px"
                  fontSize={{ base: '0.875rem', sm: '1rem' }}
                >
                  <Image
                    src={getIconUrl(user.summoner_icon)}
                    w="30px"
                    rounded="999"
                    border="2px solid #ffffff80"
                  />
                  {(user.role === 'bot' || user.role === 'creator') && (
                    <Center
                      fontSize={{ base: '8px', sm: '10px' }}
                      lineHeight="normal"
                      p="2px 3px"
                      backgroundColor="#ffffff40"
                      rounded="5px"
                      textTransform="uppercase"
                    >
                      {user.role}
                    </Center>
                  )}
                  {user.identification?.nickname}
                </Flex>
                <Flex
                  ml="auto"
                  align="center"
                  fontSize={{ base: '0.75rem', sm: '0.875rem' }}
                  gap="5px"
                >
                  <Image src={tierInfo.emblem} w="30px" />

                  {rinfo.reliable &&
                    rinfo.tier !== Tier.Master &&
                    divisionMap[rinfo.division || 1]}

                  {rinfo.reliable &&
                    rinfo.tier === Tier.Master &&
                    `${rinfo.leaguePoints} LP`}
                  {rinfo.precise && '!'}
                </Flex>
              </Flex>
            )
          })}
      </Stack>
    </>
  )
}
