import { tabsAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys)

const baseStyle = definePartsStyle({
  tab: {
    fontWeight: '600',
  },
  indicator: {
    pos: 'relative !important',
    flex: '1 0 3px',
    bg: 'pink.500',
    borderRadius: '3px',
  },
  tabpanels: {
    flex: '0 1 100%',
  },
  tabpanel: {
    h: '100%',
  },
  root: {
    display: 'flex',
    flexDir: 'column',
    h: '100%',
  },
})

export const tabsTheme = defineMultiStyleConfig({
  baseStyle,
  variants: {
    default: baseStyle,
  },
  defaultProps: {
    variant: 'default',
  },
})
