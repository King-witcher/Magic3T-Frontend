import { useConfig } from '@/contexts/config.context'
import { type RatingInfo, useRatingInfo } from '@/hooks/use-rating-info'
import { rankingQueryOptions } from '@/utils/query-options'
import { tiersMap } from '@/utils/ranks'
import { getAcrylicProps } from '@/utils/style-helpers'
import { Box, Center, Flex, Heading, Image, Stack } from '@chakra-ui/react'
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
                p="20px"
                gap="10px"
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
                <Box>{user.identification?.nickname}</Box>
                <Flex ml="auto" align="center" gap="5px">
                  {rinfo.reliable && rinfo.rating}
                  {rinfo.precise && '!'}
                  <Image src={tierInfo.emblem} w="30px" />
                </Flex>
              </Flex>
            )
          })}
      </Stack>
    </>
  )
}
