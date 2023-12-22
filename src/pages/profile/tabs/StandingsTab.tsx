import { useAsync } from '@/hooks/useAsync'
import { models } from '@/models'
import { getRatingInfo } from '@/utils/getEloUrl'
import {
  Box,
  Center,
  ColorProps,
  Flex,
  Image,
  Stack,
  Table,
  Td,
  Text,
  Tr,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'

const bgMap = {
  Bronze: 'orange.500',
  Silver: 'gray.400',
  Gold: 'yellow.300',
  Diamond: 'cyan.300',
  Elite: 'purple.300',
}

const hoverBgMap = {
  Bronze: 'orange.400',
  Silver: 'gray.300',
  Gold: 'yellow.200',
  Diamond: 'cyan.100',
  Elite: 'purple.200',
}

const borderColorMap = {
  Bronze: 'orange.700',
  Silver: 'gray.500',
  Gold: 'yellow.500',
  Diamond: 'cyan.500',
  Elite: 'purple.600',
}

export default function StandingsTab() {
  const [standings, loading] = useAsync(models.users.getStandings)

  console.log(standings)

  if (loading) return null

  return (
    <Stack gap="20px" p={{ base: '0', lg: '20px 0' }}>
      <Text
        fontSize={{ base: '25px', lg: '35px' }}
        fontWeight={600}
        color="pink.500"
      >
        Melhores jogadores de Magic3t
      </Text>
      <Stack userSelect="none">
        {standings.map((player, index) => {
          const rinfo = getRatingInfo(player.glicko)

          const bg = bgMap[rinfo.tier]
          const hoverBg = hoverBgMap[rinfo.tier]
          const borderColor = borderColorMap[rinfo.tier]

          return (
            <Flex
              as={Link}
              to={`/profile?uid=${player._id}`}
              key={player._id}
              w="full"
              alignItems="center"
              p="10px 10px"
              bg={bg}
              borderLeft="solid 5px"
              borderColor={borderColor}
              rounded="8px"
              gap={{ base: '10px', sm: '0' }}
              _hover={{
                bg: hoverBg,
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
                  <Text
                    noOfLines={1}
                    fontWeight={[700, 600]}
                    fontSize={{ base: '20px', sm: '16px' }}
                    userSelect="text"
                  >
                    {player.nickname}
                  </Text>
                </Box>
                <Box w={{ base: 'fit-content', sm: '100px' }}>
                  <Flex alignItems="center" gap="5px">
                    <Image
                      src={rinfo.thumbnail}
                      h={{ base: '24px', sm: '30px' }}
                    />
                    <Text fontWeight={[600, 800]}>
                      {rinfo.rating}
                      {rinfo.deviation > 100 && '*'}
                      {rinfo.deviation < 40 && '!'}
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
