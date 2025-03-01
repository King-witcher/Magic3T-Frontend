import { extendTheme } from '@chakra-ui/react'
import '@fontsource-variable/nunito'
import { keyframes } from '@emotion/react'
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
        bgColor: '#0A1428',
        color: 'var(--color-gold-1)',
        fontFamily: 'spiegel',
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
})
