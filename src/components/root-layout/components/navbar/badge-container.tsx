import { chakra } from '@chakra-ui/react'

export const BadgeContainer = chakra('div', {
  baseStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bg: 'whiteAlpha.300',
    color: 'white',
    fontSize: '12px',
    h: '26px',
    minW: '26px',
    borderRadius: '8px',
    userSelect: 'none',
    cursor: 'pointer',
    _hover: {
      bg: 'whiteAlpha.400',
    },
  },
})
