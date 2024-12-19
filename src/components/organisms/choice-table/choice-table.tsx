import PugDanceGif from '@/assets/pug-dance.gif'
import { ChoiceComponent } from '@/components/atoms'
import { setCommand } from '@/lib/Commands'
import type { Choice } from '@/types/game.ts'
import { getTriple } from '@/utils/getTriple'
import { getAcrylicProps } from '@/utils/style-helpers'
import { type ChakraProps, Grid, Image, Text, VStack } from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface Props extends ChakraProps {
  redMoves: Choice[]
  blueMoves: Choice[]
  state: 'selectable' | 'static' | 'disabled'
  onSelect?(choice: Choice): void
}

let initialAllChoices: Choice[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const cheatAllChoices: Choice[] = [2, 9, 4, 7, 5, 3, 6, 1, 8]
let initialPugDance = false

function randomizeCheatTable() {
  if (Math.random() >= 0.5) mirror()
  rotate(Math.random() * 4)

  function rotate(amount: number) {
    for (let count = amount; count >= 1; count--) {
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

export function ChoiceTable({
  redMoves,
  blueMoves,
  state,
  onSelect,
  ...rest
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
      {...getAcrylicProps()}
      p="20px"
      rounded="10px"
      overflow="hidden"
      w="full"
      h="fit-content"
      transition="box-shadow 1s"
      boxShadow={
        state === 'selectable'
          ? '0 0 10px 0 #00ff0080, inset 0 0 40px #40ff40ff'
          : '0 0 10px 0 #00000040'
      }
      gap="10px"
      {...rest}
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
                  ? 'opponentSelected'
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
