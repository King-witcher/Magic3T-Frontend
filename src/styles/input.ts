import { inputAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys)

const baseStyle = definePartsStyle({
  field: {
    p: '10px 15px',
    boxShadow: '0 0 5px 2px #00000020',
    _focus: {
      outine: '3px solid black',
    }
  }
})

export const inputTheme = defineMultiStyleConfig({baseStyle})