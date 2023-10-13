import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { popoverAnatomy } from '@chakra-ui/anatomy'

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(popoverAnatomy.keys)

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
    }
  },
  body: {
    m: 0,
    p: 0,
    _focus: {
      boxShadow: 'none',
    }
  },
  popper: {
    _focus: {
      boxShadow: 'none',
    }
  }
})

export const popoverTheme = defineMultiStyleConfig({
  baseStyle
})