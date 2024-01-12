import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const baseStyle = defineStyle({
  color: 'blue.600',
  fontFamily: 'Nunito Variable',
  fontWeight: '700',
})

export const headingTheme = defineStyleConfig({
  baseStyle,
})
