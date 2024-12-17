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
  bg: '#ffffff80',
  border: 'solid 1px #ffffff40',
  rounded: '10px',
  boxShadow: '0 0 10px 0 #ffffff40',
  color: 'white',
  fontSize: '20px',
  fontWeight: 400,
  fontFamily: 'nunito variable',
  p: '10px 20px',
  _hover: {
    bg: '#ffffffc0',
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
