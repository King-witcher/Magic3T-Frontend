import { useGameConnector } from '@/hooks/useGameConnector'
import { Flex, Grid } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function GamePage() {
  const { gameId } = useParams()
  const { connectGame, makeChoice, availableChoices } = useGameConnector()

  useEffect(() => {
    if (gameId) connectGame(gameId)
  }, [])

  return (
    <>
      <Grid width="fit-content" gridTemplateColumns="repeat(3, 1fr)" gap="10px">
        {availableChoices.map((choice) => (
          <Flex
            key={choice}
            w="50px"
            h="50px"
            alignItems="center"
            justifyContent="center"
            bg="gray.200"
            rounded="10px"
            fontWeight="bold"
            onClick={() => makeChoice(choice)}
          >
            {choice}
          </Flex>
        ))}
      </Grid>
    </>
  )
}
