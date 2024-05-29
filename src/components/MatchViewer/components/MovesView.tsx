import { Choice } from '@/types/game.ts'
import { Flex, VStack } from '@chakra-ui/react'
import { useCallback, useMemo, useState } from 'react'
import {
  FaBackwardFast,
  FaBackwardStep,
  FaForwardFast,
  FaForwardStep,
} from 'react-icons/fa6'
import Control from './Control'
import ChoiceTable from '@/components/ChoiceTable'
import { HistoryMatchEvent, SidesEnum } from '@/models/matches/Match'

interface Props {
  moves: HistoryMatchEvent[]
}

const allNumbers: Choice[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export default function MovesView({ moves }: Props) {
  const [index, setIndex] = useState(moves.length)

  const whiteMoves = useMemo<Choice[]>(() => {
    return moves
      .filter((move, idx) => move.side === SidesEnum.White && idx < index)
      .map((move) => move.choice)
      .filter((move) => typeof move === 'number') as Choice[]
  }, [moves, index])

  const blackMoves = useMemo<Choice[]>(() => {
    return moves
      .filter((move, idx) => move.side === SidesEnum.Black && idx < index)
      .map((move) => move.choice)
      .filter((move) => typeof move === 'number') as Choice[]
  }, [moves, index])

  // const triple = useMemo(() => {
  //   if (index === moves.length) {
  //     return getTriple(whiteMoves) || getTriple(blackMoves)
  //   }
  // }, [index, whiteMoves, blackMoves])

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
    <VStack gap="20px">
      <ChoiceTable
        blueMoves={whiteMoves}
        redMoves={blackMoves}
        state="static"
      />
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
    </VStack>
  )
}
