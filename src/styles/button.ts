import {
  type ChakraProps,
  defineStyle,
  defineStyleConfig,
} from '@chakra-ui/react'

const baseStyle = defineStyle<ChakraProps>({
  borderRadius: '10px',
  padding: '10px',
  boxSizing: 'border-box',
})

const submitForm = defineStyle<ChakraProps>({
  transition: 'background 80ms linear',
  bg: 'blue.400',
  boxShadow: 'none',
  rounded: '10px',
  color: 'white',
  fontSize: '20px',
  fontWeight: 400,
  fontFamily: 'nunito variable',
  p: '10px 20px',
  borderColor: 'blue.400',
  _hover: {
    bg: 'blue.300',
  },
  _active: {
    bg: 'blue.500',
  },
})

export const buttonTheme = defineStyleConfig({
  baseStyle,
  variants: {
    submitForm,
  },
})
