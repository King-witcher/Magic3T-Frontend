import { Box, Center, Text } from '@chakra-ui/react'

interface Props {
  choice: number
}

export default function Choice({ choice }: Props) {
  return (
    <Box
      display="inline-block"
      textIndent="0"
      position="relative"
      w="28px"
      h="28px"
      bg="pink.200"
      borderRadius="5px"
    >
      <Center w="100%" h="100%" fontSize="16px">
        {choice}
      </Center>
    </Box>
  )
}
