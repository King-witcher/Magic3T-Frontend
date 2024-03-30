import { useConfig } from '@/contexts/ConfigContext'
import { RatingColorSchemes } from '@/hooks/useRanks'
import { tiers } from '@/utils/ranks'
import {
  Box,
  Center,
  Divider,
  Flex,
  Image,
  Heading,
  Stack,
  Table,
  Text,
} from '@chakra-ui/react'

export default function RatingSystemPage() {
  const { ratingConfig } = useConfig()

  const bronze1 =
    ratingConfig.initialRating -
    ratingConfig.ranks.initialTier * ratingConfig.ranks.tierSize

  return (
    <Center>
      <Box h="100%" p="20px" maxW="800px" w="full">
        <Heading>Sistema de Ranking</Heading>
        <Divider />
        <Text fontSize={['16px', '20px']} textIndent="20px" mt="15px">
          O Magic3T usa o sistema de rating Glicko, que é comumente utilizado em
          outros jogos online 1 contra 1 para avaliar o desempenho dos seus
          jogadores, especialmente xadrez. Em suma, o seu ranking é composto por
          uma pontuação e um desvio (RD), em que a sua pontuação quantifica o
          seu nível de habilidade, enquanto que o RD mede quão impreciso a sua
          pontuação é. Em termos técnicos, o RD é o desvio padrão da
          distribuição de probabilidade da sua pontuação.{' '}
        </Text>
        <Text fontSize={['16px', '20px']} textIndent="20px" mt="15px">
          Todo novo jogador começa com uma pontuação{' '}
          {ratingConfig.initialRating} SR e um RD de {ratingConfig.initialRD}, e
          ganha/perde pontos dependendo do resultado de cada partida e do
          oponente, enquanto que seu RD diminui conforme partidas são jogadas.
        </Text>
        <Text fontSize={['16px', '20px']} textIndent="20px" mt="15px">
          Todo jogador que tiver desvio acima de{' '}
          {ratingConfig.maxReliableDeviation} terá seu rating marcado com um
          ponto de interrogação, representando imprecisão. No entanto, quando
          cai abaixo desse valor, a pontuação passa a ser considerada válida e o
          jogador é classificado em um Tier dependendo da sua pontuação. Ao
          descer abaixo de 50, rating será marcado com um ponto de exclamação,
          sinalizando que a pontuação é precisa. Veja a lista de todos os Tiers
          e seus respectivos intervalos:
        </Text>

        <Stack flexDir="column-reverse" m="15px 0">
          <Stack
            bg="gray.200"
            border="solid 1px"
            borderColor="gray.300"
            fontSize="18px"
            rounded="5px"
            flexDir="column-reverse"
            p="10px"
          >
            <Flex justifyContent="space-between">
              <Flex alignItems="center" gap="5px" w="150px">
                <Image
                  w="32px"
                  h="32px"
                  src={'https://quake-stats.bethesda.net/ranks/Zero_01.png'}
                />
                <Text>Unranked</Text>
              </Flex>
              <Text fontWeight={600} color="blackAlpha.800">
                RD &gt; {ratingConfig.maxReliableDeviation}
              </Text>
            </Flex>
          </Stack>
          {tiers.map(
            (tier, tierIndex) =>
              tier !== 'Elite' &&
              tier !== 'Unranked' && (
                <Stack
                  key={tier}
                  bg={RatingColorSchemes[tier].normal}
                  border="solid 1px"
                  borderColor={RatingColorSchemes[tier].darker}
                  fontSize="18px"
                  rounded="5px"
                  flexDir="column-reverse"
                  p="10px"
                >
                  {[1, 2, 3, 4, 5].map((division) => (
                    <Flex key={division} justifyContent="space-between">
                      <Flex alignItems="center" gap="5px" w="150px">
                        <Image
                          w="32px"
                          h="32px"
                          src={`https://quake-stats.bethesda.net/ranks/${tier}_0${division}.png`}
                        />
                        <Text>
                          {tier} {division}
                        </Text>
                      </Flex>
                      {tier === 'Bronze' && division === 1 ? (
                        <Text fontWeight={600} color="blackAlpha.800">
                          &lt; {bronze1 + ratingConfig.ranks.tierSize / 5}
                        </Text>
                      ) : (
                        <Text fontWeight={600} color="blackAlpha.800">
                          &ge;{' '}
                          {bronze1 +
                            (tierIndex - 1) * ratingConfig.ranks.tierSize +
                            ((division - 1) * ratingConfig.ranks.tierSize) / 5}
                        </Text>
                      )}
                    </Flex>
                  ))}
                </Stack>
              ),
          )}
          <Stack
            bg={RatingColorSchemes['Elite'].normal}
            border="solid 1px"
            borderColor={RatingColorSchemes['Elite'].darker}
            fontSize="18px"
            rounded="5px"
            flexDir="column-reverse"
            p="10px"
          >
            <Flex justifyContent="space-between">
              <Flex alignItems="center" gap="5px" w="150px">
                <Image
                  w="32px"
                  h="32px"
                  src={'https://quake-stats.bethesda.net/ranks/Elite_01.png'}
                />
                <Text>Elite</Text>
              </Flex>
              <Text fontWeight={600} color="blackAlpha.800">
                &ge; {bronze1 + 4 * ratingConfig.ranks.tierSize}
              </Text>
            </Flex>
          </Stack>
        </Stack>

        <Text fontSize={['16px', '20px']} textIndent="20px" mt="15px">
          Note que o Bot de dificuldade média tem sua pontuação fixada em 1500 e
          seu desvio em 0, pois ele serve como um referencial para todos os
          outros rankings.
        </Text>

        <Table rounded="10px" overflow="hidden"></Table>

        <Heading as="h3" fontSize="28px" mt="15px">
          Como sua pontuação evolui
        </Heading>
        <Text fontSize={['16px', '20px']} textIndent="20px" mt="15px">
          Você ganha ou perde pontos ao concluir partidas dependendo do
          resultado, bem como das pontuações e dos RD&apos;s de cada jogador.
        </Text>
        <Text fontSize={['16px', '20px']} textIndent="20px" mt="15px">
          Caso você derrote um oponente com pontuação maior que a sua, o sistema
          considerara como evidência de que sua pontuação está muito abaixo do
          que deveria e você ganhará mais pontos que o normal, enquanto que o
          seu oponente perderá mais. Caso seu oponente tenha menos pontos do que
          você, o sistema assume que suas pontuações estão próximas da realidade
          e seu ganho será menor.
        </Text>
        <Text fontSize={['16px', '20px']} textIndent="20px" mt="15px">
          No caso dos empates, a diferença entre as pontuações também é
          considerada: empatar com um jogador com muito mais pontos também é
          indício de que seu rating esteja baixo, e o sistema o reajustará para
          cima; no entanto, menos do que se tivesse vencido.
        </Text>
        <Text fontSize={['16px', '20px']} textIndent="20px" mt="15px">
          Além de analisar diferença entre as pontuações, o sistema Glicko
          também avalia os desvios dos dois jogadores. Quanto maior o desvio de
          um jogador, mais a sua pontuação precisa ser reajustada, uma vez que o
          sistema ainda está tentando encontrar a pontuação correta para o
          mesmo; enquanto que quanto menor o desvio do jogador, menos o sistema
          reajustará a pontuação do mesmo porque ele confia na sua pontuação e
          considera maior a probabilidade de um resultado imprevisto ter sido
          causado por acaso ou por imprecisão na pontuação do outro jogador.
        </Text>
        <Text fontSize={['16px', '20px']} textIndent="20px" mt="15px">
          Por outro lado, considerando a pontuação do seu oponente, ganhar ou
          perder de um oponente com RD baixo também fará com que sua pontuação
          seja reajustada em maior intensidade, uma vez que o sistema tem
          certeza de que você ganhou de alguém muito bom. Da mesma forma, o
          reajuste será menor caso o oponente tenha RD alto pois o Glicko não
          tem evidências suficientes de que você ganhou de um oponente bom.
        </Text>
        <Heading as="h3" fontSize="28px" mt="15px">
          Como seu desvio evolui
        </Heading>
        <Text fontSize={['16px', '20px']} textIndent="20px" mt="15px">
          O RD diminui a cada partida concluída, diminuindo mais quanto mais
          alto o seu RD for. No entanto, o desvio aumenta lentamente com o
          passar do tempo, até um máximo de {ratingConfig.initialRD}.
        </Text>
      </Box>
    </Center>
  )
}
