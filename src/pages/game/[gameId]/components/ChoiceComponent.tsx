import { Choice } from '@/types/types'
import { ChakraProps, Flex, FlexProps } from '@chakra-ui/react'
import { useMemo } from 'react'

export type ChoiceStyle =
  | 'normal'
  | 'selectable'
  | 'playerSelected'
  | 'oponentSelected'
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
        _hover: {
          bg: 'pink.200',
        },
      }
    case 'oponentSelected':
      return {
        opacity: 0.3,
        bg: 'red.200',
      }
    case 'playerSelected':
      return {
        opacity: 0.3,
        bg: 'blue.200',
      }
    case 'disabled':
      return {
        opacity: 0.3,
      }
  }
}

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
      w="50px"
      h="50px"
      alignItems="center"
      justifyContent="center"
      bg={highlight ? 'green.200' : 'gray.200'}
      rounded="10px"
      fontWeight="bold"
      userSelect="none"
      transition="opacity 300ms linear"
      {...styleOverride}
      {...rest}
    >
      {choice}
    </Flex>
  )
}
