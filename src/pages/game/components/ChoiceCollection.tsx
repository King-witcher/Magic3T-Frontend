import { Flex, FlexProps } from '@chakra-ui/react'
import ChoiceComponent from './ChoiceComponent'
import { Choice } from '@/types/types'

interface Props extends FlexProps {
  choices: Choice[]
}

export default function ChoiceCollection({ choices, ...rest }: Props) {
  return (
    <Flex gap="10px" {...rest}>
      {choices.map((choice) => (
        <ChoiceComponent key={choice} choice={choice} />
      ))}
    </Flex>
  )
}
