import { PlayerMove } from '@/models/matches/Match'
import { Choice } from '@/types/types'
import { Box, Center, Flex, Grid, Stack } from '@chakra-ui/react'
import { useCallback, useMemo, useState } from 'react'
import {
  FaBackwardFast,
  FaBackwardStep,
  FaForwardFast,
  FaForwardStep,
} from 'react-icons/fa6'
import Numberbox from './NumberBox'
import ChoiceComponent from '@/components/ChoiceComponent'
import { getTriple } from '@/utils/getTriple'
import Control from './Control'

interface Props {
  moves: PlayerMove[]
}

const allNumbers: Choice[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export default function MovesView({ moves }: Props) {
  const [index, setIndex] = useState(moves.length)

  const whiteMoves = useMemo<Choice[]>(() => {
    return moves
      .filter((move, idx) => move.player === 'white' && idx < index)
      .map((move) => move.move)
      .filter((move) => typeof move === 'number') as Choice[]
  }, [moves, index])

  const blackMoves = useMemo<Choice[]>(() => {
    return moves
      .filter((move, idx) => move.player === 'black' && idx < index)
      .map((move) => move.move)
      .filter((move) => typeof move === 'number') as Choice[]
  }, [moves, index])

  const triple = useMemo(() => {
    if (index === moves.length) {
      return getTriple(whiteMoves) || getTriple(blackMoves)
    }
  }, [index, whiteMoves, blackMoves])

  const go = useCallback(
    (amount: number) => {
      setIndex((current) => {
        const candidate = current + amount
        return Math.max(0, Math.min(candidate, moves.length))
      })
    },
    [setIndex, moves],
  )

  return (
    <Stack gap="20px">
      <Grid gridTemplateColumns="1fr 1fr 1fr" gap="10px">
        {allNumbers.map((number) => (
          <ChoiceComponent
            key={number}
            choice={number}
            choiceStyle={
              whiteMoves.includes(number)
                ? 'playerSelected'
                : blackMoves.includes(number)
                ? 'oponentSelected'
                : 'normal'
            }
            highlight={triple?.includes(number)}
          />
        ))}
      </Grid>
      <Flex
        gap="5px"
        userSelect="none"
        w="full"
        justifyContent="center"
        fontSize="18px"
      >
        <Control onClick={() => setIndex(0)} disabled={index === 0}>
          <FaBackwardFast />
        </Control>

        <Control onClick={() => go(-1)} disabled={index === 0}>
          <FaBackwardStep />
        </Control>

        <Control onClick={() => go(1)} disabled={index === moves.length}>
          <FaForwardStep />
        </Control>

        <Control
          onClick={() => setIndex(moves.length)}
          disabled={index === moves.length}
        >
          <FaForwardFast />
        </Control>
      </Flex>
    </Stack>
  )
}
