import { extendTheme } from '@chakra-ui/react'
import { modalTheme } from './modal'
import { popoverTheme } from './popover'
import { tooltipTheme } from './tooltip'

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'pink.100',
        color: 'pink.900',
      },
    },
  },
  components: {
    Button: {
      variants: {},
      baseStyle: {
        borderRadius: '10px',
        padding: '10px',
        boxSizing: '10px',
      }
    },
    Modal: modalTheme,
    Popover: popoverTheme,
    Tooltip: tooltipTheme,
  },
})