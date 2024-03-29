import { Choice, GameStatus } from '@/types/game.ts'
import ChoiceComponent from './ChoiceComponent'
import { Grid, Image, Stack, VStack, Text } from '@chakra-ui/react'
import { useGame } from '@/contexts/GameContext'
import { useCallback, useEffect, useState } from 'react'
import { setCommand } from '@/lib/Commands'
import PugDanceGif from '@/assets/pug-dance.gif'

let initialAllChoices: Choice[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const cheatAllChoices: Choice[] = [2, 9, 4, 7, 5, 3, 6, 1, 8]
let initialPugDance = false

function initialTicTacToeCheat() {
  initialAllChoices = cheatAllChoices
}

function initialSetPugDanceCheat() {
  initialPugDance = !initialPugDance
}

setCommand('3tmode', initialSetPugDanceCheat)
setCommand('ttt', initialTicTacToeCheat)

export default function LegacyChoiceTable() {
  const {
    makeChoice,
    isActive,
    turn,
    gameStatus,
    playerChoices,
    oponentChoices,
    availableChoices,
    winningTriple,
    sendMessage,
  } = useGame()
  const [allChoices, setAllChoices] = useState<Choice[]>(initialAllChoices)
  const [pugDance, setPugDance] = useState(initialPugDance)

  useEffect(() => {
    if (pugDance)
      sendMessage('fui botar 3tmode e fui pega no flagra toda bunduda c:')
  }, [pugDance])

  useEffect(() => {
    if (allChoices[0] !== 1)
      sendMessage('to aqui toda bunduda jogando de 3tmode')
  }, [allChoices])

  const ticTacToeCheat = useCallback(() => {
    initialTicTacToeCheat()
    setAllChoices(cheatAllChoices)
  }, [])

  const pugDanceCheat = useCallback(() => {
    initialSetPugDanceCheat()
    setPugDance((current) => !current)
  }, [])

  useEffect(() => {
    setCommand('3tmode', pugDanceCheat)
    setCommand('ttt', ticTacToeCheat)
    return () => {
      setCommand('3tmode', initialSetPugDanceCheat)
      setCommand('ttt', initialTicTacToeCheat)
    }
  }, [])

  const playerTurn = turn === 'player'

  if (!isActive) return null

  if (pugDance) {
    return (
      <VStack pos="relative" onClick={() => pugDanceCheat()}>
        <Image src={PugDanceGif} w="180px" h="180px" />
        <Text
          pos="absolute"
          bottom="7px"
          left="50%"
          fontSize="16px"
          textAlign="center"
          w="300px"
          transform="translate(-50%, 100%)"
          fontWeight={700}
        >
          Ó vc colocando hack no jogo
        </Text>
      </VStack>
    )
  }

  return (
    <Grid
      width="fit-content"
      gridTemplateColumns="repeat(3, 1fr)"
      gap="10px"
      h="fit-content"
    >
      {allChoices.map((choice: Choice) => {
        const enabled = gameStatus === GameStatus.Playing
        const available = availableChoices.includes(choice) && turn === 'player'
        const playerSelected = playerChoices.includes(choice)
        const oponentSelected = oponentChoices.includes(choice)

        return (
          <ChoiceComponent
            choice={choice}
            key={choice}
            highlight={winningTriple?.includes(choice)}
            choiceStyle={
              available
                ? enabled
                  ? turn
                    ? 'selectable'
                    : 'normal'
                  : 'disabled'
                : playerSelected
                ? 'playerSelected'
                : oponentSelected
                ? 'oponentSelected'
                : 'normal'
            }
            onClick={
              available && playerTurn ? () => makeChoice(choice) : undefined
            }
          />
        )
      })}
    </Grid>
  )
}
