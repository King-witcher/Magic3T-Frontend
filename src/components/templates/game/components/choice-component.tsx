import type { Choice } from '@/types/game.ts'
import { type ChakraProps, Flex, type FlexProps } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'

export type ChoiceStyle =
  | 'normal'
  | 'selectable'
  | 'playerSelected'
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
        opacity: '0.6',
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
        bg: 'red.400',
        color: 'white',
      }
    case 'playerSelected':
      return {
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

export function ChoiceComponent({
  choice,
  highlight,
  choiceStyle = 'normal',
  ...rest
}: Props) {
  const styleOverride = getStyle(choiceStyle)

  return (
    <Flex
      key={choice}
      w="60px"
      h="60px"
      alignItems="center"
      justifyContent="center"
      bg={highlight ? 'gray.200' : 'gray.200'}
      backgroundSize="200%"
      boxSizing="border-box"
      fontSize="21px"
      fontWeight="bold"
      rounded="10px"
      animation={`${highlightAnimation} infinite 3s linear`}
      userSelect="none"
      transition="opacity 300ms linear, background-color 80ms linear"
      pos="relative"
      _after={
        highlight
          ? {
              transition: 'opacity 1s linear',
              rounded: '10px',
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
