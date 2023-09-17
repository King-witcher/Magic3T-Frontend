import { extendTheme } from '@chakra-ui/react'

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
    },
  },
})
