import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const baseStyle = defineStyle({
  color: 'light',
  fontFamily: 'Nunito Variable',
  fontWeight: '300',
})

export const headingTheme = defineStyleConfig({
  baseStyle,
})
