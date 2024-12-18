import type { Choice } from '@/types/game.ts'
import { getAcrylicProps } from '@/utils/style-helpers'
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
      return {}
    case 'selectable':
      return {
        cursor: 'pointer',
        _hover: { ...getAcrylicProps(), boxShadow: 'unset' },
      }
    case 'opponentSelected':
      return {
        bg: '#ff3737c0',
        border: '1px solid #ff3737',
        boxShadow: '0 0 10px 0 #ff373780',
      }
    case 'blueSelected':
      return {
        bg: '#3787ffc0',
        border: '1px solid #3787ff',
        boxShadow: '0 0 10px 0 #3787ff80',
      }
    case 'disabled':
      return {
        opacity: 0.5,
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
  const styleOverride = useMemo(getStyle.bind(null, choiceStyle), [choiceStyle])

  return (
    <Flex
      key={choice}
      w="1fr"
      aspectRatio={1}
      // h="70px"
      alignItems="center"
      justifyContent="center"
      backgroundSize="200%"
      boxSizing="border-box"
      fontSize={{ base: '30px', sm: '25px' }}
      fontWeight="300"
      rounded="10px"
      overflow="hidden"
      m="0"
      animation={`${highlightAnimation} infinite 3s linear`}
      userSelect="none"
      transition="opacity 300ms linear, background-color 80ms linear"
      pos="relative"
      color="white"
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
