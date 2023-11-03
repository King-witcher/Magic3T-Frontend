import { menuAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys)

const baseStyle = definePartsStyle({
  list: {
    borderRadius: '10px',
    p: '10px',
    border: 'none',
    boxShadow: '0 0 30px 10px #00000030',
    w: '280px',
    display: 'flex',
    gap: '5px',
    flexDirection: 'column',
  },
  item: {
    p: '0 20px',
    borderRadius: '5px',
    h: '40px',
    color: 'black',
    _hover: {
      bg: 'pink.200',
    },
    _focus: {
      bg: 'initial',
    },
    _active: {
      bg: 'initial',
    },
  },
})

export const menuTheme = defineMultiStyleConfig({
  baseStyle,
})
