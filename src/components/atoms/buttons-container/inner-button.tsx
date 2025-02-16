import { Center, type CenterProps } from '@chakra-ui/react'
import type { ReactNode } from '@tanstack/react-router'

interface Props extends CenterProps {
  children: ReactNode
  isDisabled?: boolean
}

export function InnerButton({ children, isDisabled, ...rest }: Props) {
  return (
    <Center
      className="hover-acrylic !border-none !bg-transparent"
      flex={{ base: '1 0 75px', sm: '1' }}
      h="75px"
      cursor={isDisabled ? 'unset' : 'pointer'}
      transition="all 200ms, box-shadow 500ms"
      userSelect="none"
      _active={
        isDisabled
          ? undefined
          : {
              opacity: '0.6',
            }
      }
      {...rest}
    >
      {children}
    </Center>
  )
}
