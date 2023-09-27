import { popoverAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(popoverAnatomy.keys)

const baseStyle = definePartsStyle({

  content: {
    borderRadius: '10px',
    margin: '0 20px',
    padding: 0,
    boxShadow: 'none',
  },
  arrow: {
    bg: 'pink.400',
  },
  header: {
    margin: 0,
    padding: '10px',
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
  },
  closeButton: {
    top: '10px',
    right: '10px',
  }
})
export const popoverTheme = defineMultiStyleConfig({ baseStyle })