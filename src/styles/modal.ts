import { modalAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(modalAnatomy.keys)

const baseStyle = definePartsStyle({
  overlay: {
    bg: 'radial-gradient(#00000080, #00000040 70.7%)',
  },
  dialog: {
    borderRadius: '10px',
    padding: '10px',
    background: '#ffffff30',
    border: '1px solid #ffffff40',
    boxShadow: '0 0 10px 0 #00000040',
    backdropFilter: 'blur(10px)',
    color: 'light',
    margin: '10px',
  },
  header: {
    margin: 0,
    padding: '10px',
  },
  body: {
    margin: '20px 0',
    padding: '10px',
    justifyContent: 'center',
    display: 'flex',
    flexDir: 'column',
  },
  footer: {
    margin: 0,
    padding: 0,
    gap: '10px',
  },
  closeButton: {
    top: '10px',
    right: '10px',
  },
})

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
})
