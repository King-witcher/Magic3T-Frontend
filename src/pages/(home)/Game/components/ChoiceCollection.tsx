import { Flex, FlexProps } from '@chakra-ui/react'
import ChoiceComponent from './ChoiceComponent'
import { Choice } from '@/types/types'

interface Props extends FlexProps {
  choices: Choice[]
  triple: [Choice, Choice, Choice] | null
}

export default function ChoiceCollection({ choices, triple, ...rest }: Props) {
  return (
    <Flex gap="10px" flexWrap="wrap" {...rest}>
      {choices.map((choice) => (
        <ChoiceComponent
          key={choice}
          choice={choice}
          highlight={!!triple?.includes(choice)}
        />
      ))}
    </Flex>
  )
}
