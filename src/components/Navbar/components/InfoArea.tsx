import { Flex, Tooltip } from '@chakra-ui/react'
import { BiSolidErrorCircle } from 'react-icons/bi'
import { WarningIcon } from '@chakra-ui/icons'

interface Props {
  message: string
  type: 'error' | 'info'
}

export default function InfoButton({ message, type }: Props) {
  return (
    <Flex
      color="red"
      bg="whiteAlpha.800"
      borderRadius="100%"
      w="fit-content"
      h="fit-content"
      alignItems="center"
      justifyContent="center"
      fontSize="20px"
    >
      <Tooltip label={message}>
        <WarningIcon />
      </Tooltip>
    </Flex>
  )
}
