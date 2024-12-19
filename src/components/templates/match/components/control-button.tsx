import { getAcrylicProps } from '@/utils/style-helpers'
import { Center, type CenterProps } from '@chakra-ui/react'

interface Props extends CenterProps {
  disabled?: boolean
}

export function ControlButton({ children, disabled, ...rest }: Props) {
  return (
    <Center
      {...getAcrylicProps()}
      rounded="8px"
      boxShadow="none"
      p="12px"
      transition="80ms linear all"
      cursor={disabled ? 'normal' : 'pointer'}
      opacity={disabled ? '0.5' : '1'}
      _hover={
        disabled
          ? {}
          : {
              bg: '#ffffff60',
            }
      }
      {...rest}
    >
      {children}
    </Center>
  )
}
