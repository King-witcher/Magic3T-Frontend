import { Center, type CenterProps } from '@chakra-ui/react'
import type { ReactNode } from '@tanstack/react-router'

interface Props extends CenterProps {
  children: ReactNode
  isDisabled?: boolean
}

export function InnerButton({ children, isDisabled, ...rest }: Props) {
  return (
    <Center
      flex={{ base: '1 0 75px', sm: '1' }}
      h="75px"
      background="#ffffff30"
      color="light"
      cursor={isDisabled ? 'unset' : 'pointer'}
      transition="all 200ms, box-shadow 500ms"
      userSelect="none"
      _hover={
        isDisabled
          ? undefined
          : {
              bg: '#ffffff60',
            }
      }
      _active={
        isDisabled
          ? undefined
          : {
              bg: '#ffffff20',
            }
      }
      {...rest}
    >
      {children}
    </Center>
  )
}
