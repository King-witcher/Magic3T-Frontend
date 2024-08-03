import { useAuth } from '@/contexts/auth.context.tsx'
import { useConfig } from '@/contexts/config.context.tsx'
import { useRankInfo } from '@/hooks/useRanks'
import { standingsOptions } from '@/utils/query-options'
import {
  Badge,
  Box,
  Center,
  Flex,
  Image,
  Select,
  Stack,
  Text,
  keyframes,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

const appear = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

export function RankingTab() {
  const [filter, setFilter] = useState<'valid' | 'modified' | 'all'>('valid')
  const { data: standings, refetch } = useQuery({
    ...standingsOptions(),
    enabled: false,
  })
  const { ratingConfig } = useConfig()
  const { user: authUser } = useAuth()
  const { getRD, getRankInfo } = useRankInfo()

  useEffect(() => {
    if (!standings) refetch()
  }, [standings, refetch])

  const filtered =
    filter === 'valid'
      ? standings?.filter(
          (user) => getRD(user.glicko) < ratingConfig.maxReliableDeviation
        )
      : filter === 'modified'
        ? standings?.filter((user) => getRD(user.glicko) < 350)
        : standings

  return (
    <Stack gap="20px" p={{ base: '0', lg: '20px 0' }}>
      <Text
        fontSize={{ base: '25px', lg: '35px' }}
        fontWeight={600}
        color="blue.500"
      >
        Melhores jogadores de Magic3t
      </Text>
      <Select
        value={filter}
        onChange={(e) =>
          setFilter(e.target.value as 'valid' | 'modified' | 'all')
        }
        colorScheme="blue"
        size="lg"
        borderRadius="8px"
        fontWeight={600}
      >
        <option value="valid">Válidos</option>
        <option value="modified">Modificados</option>
        <option value="all">Todos</option>
        Filtrar ratings incertos
      </Select>
      <Stack userSelect="none">
        {filtered?.map((player, index) => {
          const rinfo = getRankInfo(player.glicko)

          const delay = (0.5 * index) / filtered.length

          return (
            <Flex
              animation={`${appear} ${delay}s ease-in`}
              as={Link}
              to={authUser?._id === player._id ? '/me' : `/user/${player._id}`}
              key={filtered.length + player._id}
              w="full"
              alignItems="center"
              p="10px 10px"
              bg={rinfo.colorScheme.normal}
              borderLeft="solid 5px"
              borderColor={rinfo.colorScheme.darker}
              transition="background linear 80ms"
              rounded="8px"
              gap={{ base: '10px', sm: '0' }}
              _hover={{
                bg: rinfo.colorScheme.lighter,
              }}
            >
              <Center textAlign="center" w="50px" p="10px">
                <Text
                  fontWeight={[600, 800]}
                  fontSize={{ base: '20px', sm: '16px' }}
                >
                  #{index + 1}
                </Text>
              </Center>
              <Flex
                w="full"
                flexDir={{ base: 'column', sm: 'row' }}
                alignItems={{ base: 'flex-start', sm: 'center' }}
              >
                <Box flex={{ base: '0', sm: '1' }}>
                  <Flex alignItems="center" gap="5px">
                    {player.role === 'bot' && (
                      <Badge rounded="5px" fontSize="12px" bg="blackAlpha.300">
                        Bot
                      </Badge>
                    )}
                    <Text
                      noOfLines={1}
                      fontWeight={[700, 600]}
                      fontSize={{ base: '20px', sm: '16px' }}
                      userSelect="text"
                    >
                      {player.nickname}
                    </Text>
                  </Flex>
                </Box>
                <Box w={{ base: 'fit-content', sm: '100px' }}>
                  <Flex alignItems="center" gap="5px">
                    <Image
                      src={rinfo.thumbnail}
                      h={{ base: '24px', sm: '30px' }}
                    />
                    <Text fontWeight={[600, 800]}>
                      {rinfo.rating}
                      {rinfo.deviation >= ratingConfig.maxReliableDeviation &&
                        '?'}
                      {rinfo.deviation < 50 && '!'}
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            </Flex>
          )
        })}
      </Stack>
    </Stack>
  )
}
