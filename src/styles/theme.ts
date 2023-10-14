import { extendTheme } from '@chakra-ui/react'
import { modalTheme } from './modal'
import { popoverTheme } from './popover'
import { tooltipTheme } from './tooltip'
import { buttonTheme } from './button'

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'pink.100',
        color: 'pink.900',
      },
    },
  },
  config: {
    initialColorMode: 'light',
  },
  components: {
    Button: buttonTheme,
    Modal: modalTheme,
    Popover: popoverTheme,
    Tooltip: tooltipTheme,
  },
})