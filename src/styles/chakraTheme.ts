import { extendTheme, keyframes } from '@chakra-ui/react'
import { buttonTheme } from './button'
import { inputTheme } from './input'
import { menuTheme } from './menu'
import { modalTheme } from './modal'
import { popoverTheme } from './popover'
import { textareaTheme } from './textarea'
import { tooltipTheme } from './tooltip'
import '@fontsource-variable/nunito'
import { headingTheme } from './heading'
import { tabsTheme } from './tabs'
import { colors } from './colors'

const scrollbarAnimation = keyframes`
  from {
    width: 0px;
  }
  to {}
`

export const chakraTheme = extendTheme({
  styles: {
    global: {
      '*': {
        '::-webkit-scrollbar': {
          w: '5px',
          animation: `${scrollbarAnimation} 500ms linear`,
        },
        '::-webkit-scrollbar-thumb': {
          w: '5px',
          bg: '#ffffff80',
          borderRadius: '999px',
        },
      },
      body: {
        bg: '#281e55',
        color: 'light',
        fontFamily: 'Nunito Variable',
        '::-webkit-scrollbar': {
          w: '5px',
          animation: `${scrollbarAnimation} 500ms linear`,
        },
        '::-webkit-scrollbar-thumb': {
          w: '5px',
          bg: 'blue.700',
          borderRadius: '999px',
        },
      },
    },
  },
  config: {
    initialColorMode: 'light',
  },
  colors,
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
