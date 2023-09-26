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
      baseStyle: {
        borderRadius: '10px',
        padding: '10px',
        boxSizing: '10px',
      }
    },
    ModalContent: {
      baseStyle: {
        ronded: '10px',
      }
    },
    ModalFooter: {
      baseStyle: {
        gap: '10px',
      }
    }
  },
})
