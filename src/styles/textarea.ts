import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const baseStyle = defineStyle({
  p: '10px 15px',
  boxShadow: '0 0 5px 2px #00000020',
  _focus: {
    outine: '3px solid black',
  },
})

export const textareaTheme = defineStyleConfig({ baseStyle })
