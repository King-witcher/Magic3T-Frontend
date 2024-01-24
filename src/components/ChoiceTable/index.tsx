import { Choice } from '@/types/types'
import { Grid, Stack, VStack, Image, Text } from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import ChoiceComponent from '@/components/ChoiceComponent'
import { getTriple } from '@/utils/getTriple'
import { setCommand } from '@/lib/Commands'
import PugDanceGif from '@/assets/pug-dance.gif'

interface Props {
  redMoves: Choice[]
  blueMoves: Choice[]
  state: 'selectable' | 'static' | 'disabled'
  onSelect?(choice: Choice): void
}

const allChoices: Choice[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
let initialAllChoices: Choice[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const cheatAllChoices: Choice[] = [2, 9, 4, 7, 5, 3, 6, 1, 8]
let initialPugDance = false

function randomizeCheatTable() {
  if (Math.random() >= 0.5) mirror()
  rotate(Math.random() * 4)

  function rotate(amount: number) {
    for (; amount >= 1; amount--) {
      let memo = cheatAllChoices[0]
      cheatAllChoices[0] = cheatAllChoices[6]
      cheatAllChoices[6] = cheatAllChoices[8]
      cheatAllChoices[8] = cheatAllChoices[2]
      cheatAllChoices[2] = memo

      memo = cheatAllChoices[1]
      cheatAllChoices[1] = cheatAllChoices[3]
      cheatAllChoices[3] = cheatAllChoices[7]
      cheatAllChoices[7] = cheatAllChoices[5]
      cheatAllChoices[5] = memo
    }
  }

  function mirror() {
    let memo = cheatAllChoices[0]
    cheatAllChoices[0] = cheatAllChoices[2]
    cheatAllChoices[2] = memo

    memo = cheatAllChoices[3]
    cheatAllChoices[3] = cheatAllChoices[5]
    cheatAllChoices[5] = memo

    memo = cheatAllChoices[6]
    cheatAllChoices[6] = cheatAllChoices[8]
    cheatAllChoices[8] = memo
  }
}

function initialTicTacToeCheat() {
  randomizeCheatTable()
  initialAllChoices = cheatAllChoices
}

function initialSetPugDanceCheat() {
  initialPugDance = !initialPugDance
}

setCommand('3tmode', initialSetPugDanceCheat)
setCommand('ttt', initialTicTacToeCheat)

export default function ChoiceTable({
  redMoves,
  blueMoves,
  state,
  onSelect,
}: Props) {
  const [allChoices, setAllChoices] = useState<Choice[]>(initialAllChoices)
  const [pugDance, setPugDance] = useState(initialPugDance)

  const triple = useMemo(() => {
    if (redMoves.length >= 3) {
      const triple = getTriple(redMoves)
      if (triple) return triple
    }
    if (blueMoves.length >= 3) {
      const triple = getTriple(blueMoves)
      if (triple) return triple
    }
  }, [redMoves, blueMoves])

  const ticTacToeCheat = useCallback(() => {
    initialTicTacToeCheat()
    console.log('tictic')
    setAllChoices([...cheatAllChoices])
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
      gridTemplateColumns="repeat(3, 1fr)"
      rounded="16px"
      overflow="hidden"
      w="fit-content"
      h="fit-content"
      // border="solid 1px var(--chakra-colors-gray-200)"
      // bg="gray.200"
    >
      {allChoices.map((number) => {
        const blueChoice = blueMoves.includes(number)
        const redChoice = redMoves.includes(number)
        const available = state === 'selectable' && !(blueChoice || redChoice)

        return (
          <ChoiceComponent
            key={number}
            choice={number}
            choiceStyle={
              blueChoice
                ? 'blueSelected'
                : redChoice
                ? 'oponentSelected'
                : state === 'selectable'
                ? 'selectable'
                : state === 'disabled'
                ? 'disabled'
                : 'normal'
            }
            onClick={available && onSelect ? () => onSelect(number) : undefined}
            highlight={triple?.includes(number)}
          />
        )
      })}
    </Grid>
  )
}
