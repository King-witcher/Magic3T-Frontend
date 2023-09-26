import { modalAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(modalAnatomy.keys)

const baseStyle = definePartsStyle({
  overlay: {
  },
  dialog: {
    borderRadius: '10px',
    padding: '10px',
    margin: '10px',
  },
  header: {
    margin: 0,
    padding: '10px',
  },
  body: {
    margin: '20px 0',
    padding: '10px',
    alignItems: 'center',
    display: 'flex',
  },
  footer: {
    margin: 0,
    padding: 0,
    gap: '10px',
  },
  closeButton: {
    top: '10px',
    right: '10px',
  }
})

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
})