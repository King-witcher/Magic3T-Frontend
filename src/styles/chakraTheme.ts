import { extendTheme } from '@chakra-ui/react'
import { modalTheme } from './modal'
import { popoverTheme } from './popover'
import { tooltipTheme } from './tooltip'
import { buttonTheme } from './button'
import { menuTheme } from './menu'
import { inputTheme } from './input'
import { textareaTheme } from './textarea'
import '@fontsource-variable/nunito'
import { tabsTheme } from './tabs'
import { headingTheme } from './heading'

export const chakraTheme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'pink.100',
        color: 'pink.900',
        fontFamily: 'Nunito Variable',
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
    Tabs: tabsTheme,
    Heading: headingTheme,
  },
})