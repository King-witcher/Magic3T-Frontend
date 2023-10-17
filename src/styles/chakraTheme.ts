import { extendTheme } from '@chakra-ui/react'
import { modalTheme } from './modal'
import { popoverTheme } from './popover'
import { tooltipTheme } from './tooltip'
import { buttonTheme } from './button'
import { menuTheme } from './menu'
import { inputTheme } from './input'
import { textareaTheme } from './textarea'

export const chakraTheme = extendTheme({
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
    Menu: menuTheme,
    Input: inputTheme,
    Textarea: textareaTheme,
  },
})