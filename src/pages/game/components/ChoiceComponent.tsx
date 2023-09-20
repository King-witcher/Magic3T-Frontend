import { Choice } from '@/types/types'
import { Flex, FlexProps } from '@chakra-ui/react'

interface Props extends FlexProps {
  choice: Choice
  highlight?: boolean
}

export default function ChoiceComponent({ choice, highlight, ...rest }: Props) {
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
      {...rest}
    >
      {choice}
    </Flex>
  )
}
