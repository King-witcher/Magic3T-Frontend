import { ChakraProps, defineStyle, defineStyleConfig } from '@chakra-ui/react'

const baseStyle = defineStyle<ChakraProps>({
  borderRadius: '10px',
  padding: '10px',
  boxSizing: 'border-box',
})

const signIn = defineStyle<ChakraProps>({
  bg: 'whiteAlpha.300',
  color: 'white',
})

export const buttonTheme = defineStyleConfig({
  baseStyle,
  variants: {
    signIn,
  },
})
