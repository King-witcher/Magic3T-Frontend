import { Choice, GameStatus } from '@/types/types'
import ChoiceComponent from './ChoiceComponent'
import { Grid } from '@chakra-ui/react'
import { useGame } from '@/contexts/GameContext'
import { useCallback, useEffect, useState } from 'react'
import { setCommand } from '@/lib/Commands'

let initialAllChoices: Choice[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const cheatAllChoices: Choice[] = [2, 9, 4, 7, 5, 3, 6, 1, 8]

function initialTicTacToeCheat() {
  initialAllChoices = cheatAllChoices
}

setCommand('3tmode', initialTicTacToeCheat)

export default function ChoiceTable() {
  const { makeChoice, gameState, availableChoices, winningTriple } = useGame()
  const [allChoices, setAllChoices] = useState<Choice[]>(initialAllChoices)

  const ticTacToeCheat = useCallback(() => {
    initialTicTacToeCheat()
    setAllChoices(cheatAllChoices)
  }, [])

  useEffect(() => {
    setCommand('3tmode', ticTacToeCheat)
    return () => {
      setCommand('3tmode', initialTicTacToeCheat)
    }
  }, [])

  const playerTurn = gameState?.turn === 'player'

  if (!gameState) return null

  return (
    <Grid
      width="fit-content"
      gridTemplateColumns="repeat(3, 1fr)"
      gap="10px"
      h="fit-content"
    >
      {allChoices.map((choice: Choice) => {
        const enabled = gameState.gameStatus === GameStatus.Playing
        const available = availableChoices.includes(choice)
        const playerSelected = gameState.player.choices.includes(choice)
        const oponentSelected = gameState.oponent.choices.includes(choice)

        return (
          <ChoiceComponent
            choice={choice}
            key={choice}
            highlight={winningTriple?.includes(choice)}
            choiceStyle={
              available
                ? enabled
                  ? gameState.turn
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
