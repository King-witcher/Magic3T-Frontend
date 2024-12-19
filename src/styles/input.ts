import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys)

const baseStyle = definePartsStyle({
  field: {
    p: '10px 15px',
    boxShadow: '0 0 5px 2px #00000020',
    _focus: {
      outine: '3px solid black',
    },
  },
})

const form = definePartsStyle({
  field: {
    bg: '#ffffff20 padding-box',
    border: 'solid 1px #ffffff80',
    boxShadow: 'none',
    rounded: '10px',
    color: 'light',
    p: { base: '10px 15px', lg: '15px 18px' },
    _focus: {
      bg: '#ffffff40',
      border: 'solid 1px #ffffff80',
    },
    _placeholder: {
      color: '#ffffff80',
    },
  },
})

export const inputTheme = defineMultiStyleConfig({
  baseStyle,
  variants: { form },
})
