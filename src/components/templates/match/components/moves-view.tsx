import { ChoiceTable } from '@/components/organisms'
import { type HistoryMatchEvent, MatchSide } from '@/models/matches/Match'
import type { Choice } from '@/types/game.ts'
import { Flex, VStack } from '@chakra-ui/react'
import { useCallback, useMemo, useState } from 'react'
import {
  FaBackwardFast,
  FaBackwardStep,
  FaForwardFast,
  FaForwardStep,
} from 'react-icons/fa6'
import { ControlButton } from './control-button'

interface Props {
  moves: HistoryMatchEvent[]
}

export function MovesView({ moves }: Props) {
  const [index, setIndex] = useState(moves.length)

  const whiteMoves = useMemo<Choice[]>(() => {
    return moves
      .filter((move, idx) => move.side === MatchSide.White && idx < index)
      .map((move) => move.choice)
      .filter((move) => typeof move === 'number') as Choice[]
  }, [moves, index])

  const blackMoves = useMemo<Choice[]>(() => {
    return moves
      .filter((move, idx) => move.side === MatchSide.Black && idx < index)
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
    [setIndex, moves]
  )

  return (
    <VStack gap="20px">
      <ChoiceTable
        blueMoves={whiteMoves}
        redMoves={blackMoves}
        state="static"
        w={{ base: 'full', sm: '240px' }}
      />
      <Flex
        gap="5px"
        userSelect="none"
        w="full"
        justifyContent="center"
        fontSize="18px"
      >
        <ControlButton onClick={() => setIndex(0)} disabled={index === 0}>
          <FaBackwardFast />
        </ControlButton>

        <ControlButton onClick={() => go(-1)} disabled={index === 0}>
          <FaBackwardStep />
        </ControlButton>

        <ControlButton onClick={() => go(1)} disabled={index === moves.length}>
          <FaForwardStep />
        </ControlButton>

        <ControlButton
          onClick={() => setIndex(moves.length)}
          disabled={index === moves.length}
        >
          <FaForwardFast />
        </ControlButton>
      </Flex>
    </VStack>
  )
}
