import { League, NestApi } from '@/services/nest-api'
import { divisionMap, leaguesMap } from '@/utils/ranks'
import { getAcrylicProps } from '@/utils/style-helpers'
import { getIconUrl } from '@/utils/utils'
import { Center, Flex, Heading, Image, Spinner, Stack } from '@chakra-ui/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

export function RankingTemplate() {
  const rankingQuery = useSuspenseQuery({
    queryKey: ['ranking'],
    staleTime: 30 * 1000,
    async queryFn() {
      return await NestApi.User.getRanking()
    },
  })

  return (
    <>
      <Heading>Top Magic3T players</Heading>
      {rankingQuery.isSuccess && (
        <Stack spacing="10px" mt="40px" pb="40px">
          {rankingQuery.data.map((user, index) => {
            const isProvisional = user.rating.league === League.Provisional
            const isApex = user.rating.league === League.Master
            const leagueInfo = leaguesMap[user.rating.league]
            return (
              <Flex
                as={Link}
                from="/ranking"
                to={`/users/${user.nickname?.replaceAll(' ', '')}`}
                key={user.id}
                align="center"
                p={{ base: '20px 15px', sm: '20px' }}
                gap={{ base: '5px', sm: '10px' }}
                opacity={isProvisional ? 0.5 : 1}
                {...getAcrylicProps()}
                transition="background-color 200ms"
                _hover={{
                  bgColor: '#ffffff40',
                }}
              >
                <Center fontWeight={700} flex="0 0 25px">
                  {isProvisional ? '-' : `#${index + 1}`}
                </Center>{' '}
                <Flex
                  align={'center'}
                  gap="5px"
                  fontSize={{ base: '0.875rem', sm: '1rem' }}
                >
                  <Image
                    src={getIconUrl(user.summonerIcon)}
                    boxSize="30px"
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
                  {user?.nickname ?? '?'}
                </Flex>
                <Flex
                  ml="auto"
                  align="center"
                  fontSize={{ base: '0.75rem', sm: '0.875rem' }}
                  minW="50px"
                  gap="5px"
                >
                  <img
                    className="size-[30px] drop-shadow-[0_0px_2px_#00000080]"
                    alt={leagueInfo.name}
                    title={leagueInfo.name}
                    src={leagueInfo.icon}
                  />

                  {!isProvisional &&
                    !isApex &&
                    divisionMap[user.rating.division || 1]}

                  {isApex && `${user.rating.points} LP`}
                  {/* {rinfo.precise && '!'} */}
                </Flex>
              </Flex>
            )
          })}
        </Stack>
      )}
      {rankingQuery.isPending && (
        <Center p="30px" h="1fr">
          <Spinner size="md" thickness="4px" color="light" speed="666ms" />
        </Center>
      )}
    </>
  )
}
