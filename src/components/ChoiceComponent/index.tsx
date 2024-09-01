import type { Choice } from '@/types/game.ts'
import {
  type ChakraProps,
  Flex,
  type FlexProps,
  keyframes,
} from '@chakra-ui/react'
import { useMemo } from 'react'

export type ChoiceStyle =
  | 'normal'
  | 'selectable'
  | 'blueSelected'
  | 'opponentSelected'
  | 'disabled'

interface Props extends FlexProps {
  choice: Choice
  choiceStyle?: ChoiceStyle
  highlight?: boolean
}

function getStyle(choiceStyle: ChoiceStyle): ChakraProps {
  switch (choiceStyle) {
    case 'normal':
      return {
        opacity: 1,
        bg: 'white',
      }
    case 'selectable':
      return {
        cursor: 'pointer',
        _hover: {
          bg: 'blue.100',
        },
      }
    case 'opponentSelected':
      return {
        //opacity: 0.5,
        bg: 'red.400',
        color: 'white',
      }
    case 'blueSelected':
      return {
        //opacity: 0.5,
        bg: 'blue.400',
        color: 'white',
      }
    case 'disabled':
      return {
        opacity: 0.3,
      }
  }
}

const highlightAnimation = keyframes`
  0% {
    background-position: -100% -100%;
  }
  100% {
    background-position: 100% 100%;
  }
`

const appear = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

export default function ChoiceComponent({
  choice,
  highlight,
  choiceStyle = 'normal',
  ...rest
}: Props) {
  const styleOverride = useMemo(getStyle.bind(null, choiceStyle), [choiceStyle])

  return (
    <Flex
      key={choice}
      w="70px"
      h="70px"
      alignItems="center"
      justifyContent="center"
      backgroundSize="200%"
      boxSizing="border-box"
      fontSize="25px"
      fontWeight="300"
      m="0"
      animation={`${highlightAnimation} infinite 3s linear`}
      userSelect="none"
      transition="opacity 300ms linear, background-color 80ms linear"
      pos="relative"
      _after={
        highlight
          ? {
              transition: 'opacity 1s linear',
              content: '""',
              inset: '0',
              pos: 'absolute',
              w: 'full',
              h: 'full',
              bg: 'linear-gradient(45deg, transparent, #ffffff80, transparent, #ffffff80)',
              bgSize: '200%',
              animation: `${highlightAnimation} infinite 700ms linear, ${appear} 1s linear`,
            }
          : {}
      }
      {...styleOverride}
      {...rest}
    >
      {choice}
    </Flex>
  )
}
