import { extendTheme, keyframes } from '@chakra-ui/react'
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

const scrollbarAnimation = keyframes`
  from {
    width: 0px;
  }
  to {}
`

export const chakraTheme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'pink.100',
        color: 'blackAlpha.800',
        fontFamily: 'Nunito Variable',
        '::-webkit-scrollbar': {
          w: '5px',
          animation: `${scrollbarAnimation} 500ms linear`,
        },
        '::-webkit-scrollbar-thumb': {
          w: '5px',
          bg: 'pink.700',
          borderRadius: '999px',
        },
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
