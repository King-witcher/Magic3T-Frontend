import { Choice, GameStatus } from '@/types/types'
import ChoiceComponent from './ChoiceComponent'
import { Grid } from '@chakra-ui/react'
import { useGame } from '@/contexts/GameContext'

const allChoices: Choice[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export default function ChoiceGrid() {
  const { makeChoice, gameState, availableChoices } = useGame()

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
            choiceStyle={
              available
                ? enabled
                  ? 'selectable'
                  : 'disabled'
                : playerSelected
                ? 'playerSelected'
                : oponentSelected
                ? 'oponentSelected'
                : 'normal'
            }
            onClick={playerTurn ? () => makeChoice(choice) : undefined}
          />
        )
      })}
    </Grid>
  )
}
