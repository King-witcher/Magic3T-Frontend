import { popoverAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(popoverAnatomy.keys)

const messageBox = definePartsStyle({
  content: {
    borderRadius: '10px',
    margin: '0 20px',
    padding: 0,
    border: 'none',
    boxShadow: '0 0 30px 10px #00000030',
  },
  arrow: {
    bg: 'pink.400',
    border: 'none',
  },
  header: {
    margin: 0,
    padding: '10px 20px',
  },
  body: {
    margin: 0,
    padding: '10px',
  },
  footer: {
    margin: 0,
    padding: '10px',
  },
  popper: {
    borderRadius: '10px',
    border: 'none',
  },
  closeButton: {
    top: '10px',
    right: '10px',
  },
})

const baseStyle = definePartsStyle({
  content: {
    bg: 'white',
    color: 'black',
    m: 0,
    p: '10px',
    boxShadow: '0 0 10px 0 #00000030',
    borderRadius: '10px',
    _focusVisible: {
      boxShadow: 'auto',
    },
  },
  body: {
    m: 0,
    p: 0,
    _focus: {
      boxShadow: 'none',
    },
  },
  popper: {
    _focus: {
      boxShadow: 'none',
    },
  },
})

export const popoverTheme = defineMultiStyleConfig({
  baseStyle,
  variants: {
    messageBox,
  },
})
