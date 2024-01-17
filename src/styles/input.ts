import { inputAnatomy } from '@chakra-ui/anatomy'
import { extendTheme } from '@chakra-ui/react'
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
    bg: 'gray.100',
    boxShadow: 'none',
    borderStyle: 'solid',
    borderWidth: '0 0 0 5px',
    rounded: '10px',
    p: { base: '10px 15px', lg: '15px 18px' },
    borderColor: 'blue.400',
    _focus: {
      bg: 'gray.50',
      borderWidth: '1px 1px 1px 5px',
    },
  },
})

export const inputTheme = defineMultiStyleConfig({
  baseStyle,
  variants: { form },
})
