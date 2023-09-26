import { Flex, VStack, Text } from '@chakra-ui/layout'
import { TimeCounter } from './TimeCounter'
import ChoiceCollection from './ChoiceCollection'
import { useGame } from '@/contexts/GameContext'

interface Props {
  player: 'current' | 'opponent'
}

export default function PlayerDeck({ player }: Props) {
  const { playerChoices, oponentChoices, playerTimer, oponentTimer, triple } =
    useGame()

  const currentPlayer = player === 'current'
  const choices = currentPlayer ? playerChoices : oponentChoices
  const timer = currentPlayer ? playerTimer : oponentTimer

  return (
    <Flex
      flex="1"
      w="100%"
      justifyContent={currentPlayer ? 'flex-start' : 'flex-end'}
      alignItems={currentPlayer ? 'flex-end' : 'flex-start'}
    >
      <Flex
        alignItems="center"
        h="fit-content"
        gap="30px"
        margin="10px"
        flexDir={currentPlayer ? 'row' : 'row-reverse'}
      >
        <VStack>
          <Flex
            rounded="100%"
            bg={currentPlayer ? 'green.500' : 'red.600'}
            w="70px"
            h="70px"
            alignItems="center"
            justifyContent="center"
            fontWeight="bold"
            color="white"
          >
            <TimeCounter timer={timer} />
          </Flex>
          <Text fontWeight="bold">{currentPlayer ? 'Você' : 'Anônimo'}</Text>
        </VStack>
        <ChoiceCollection
          choices={choices}
          triple={triple}
          flexDir={currentPlayer ? 'row' : 'row-reverse'}
        />
      </Flex>
    </Flex>
  )
}
