import { useGameConnector } from '@/hooks/useGameConnector'
import { Box, Flex, Grid, VStack, Text } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ChoiceComponent from '../components/ChoiceComponent'
import ChoiceCollection from '../components/ChoiceCollection'

export default function GamePage() {
  const { gameId } = useParams()
  const {
    connectGame,
    makeChoice,
    availableChoices,
    playerChoices,
    oponentChoices,
  } = useGameConnector()

  useEffect(() => {
    if (gameId) connectGame(gameId)
  }, [])

  return (
    <VStack h="100%" justifyContent="space-around">
      <Flex flex="1" w="100%" justifyContent="flex-end">
        <Flex alignItems="center" h="fit-content" gap="30px" margin="10px">
          <ChoiceCollection choices={oponentChoices} flexDir="row-reverse" />
          <VStack>
            <Box rounded="100%" bg="red.500" w="70px" h="70px" />
            <Text fontWeight="bold">Anônimo</Text>
          </VStack>
        </Flex>
      </Flex>
      <Grid
        width="fit-content"
        gridTemplateColumns="repeat(3, 1fr)"
        gap="10px"
        h="fit-content"
      >
        {availableChoices.map((choice) => (
          <ChoiceComponent
            choice={choice}
            onClick={() => makeChoice(choice)}
            cursor="pointer"
            _hover={{
              bg: 'pink.200',
            }}
          />
        ))}
      </Grid>
      <Flex flex="1" w="100%" justifyContent="flex-start" alignItems="flex-end">
        <Flex alignItems="center" h="fit-content" gap="30px" margin="10px">
          <VStack>
            <Box rounded="100%" bg="green.500" w="70px" h="70px" />
            <Text fontWeight="bold">Você</Text>
          </VStack>
          <ChoiceCollection choices={playerChoices} />
        </Flex>
      </Flex>
    </VStack>
  )
}
