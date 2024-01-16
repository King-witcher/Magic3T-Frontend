import { Center, CenterProps } from '@chakra-ui/react'

interface Props extends CenterProps {
  disabled?: boolean
}

export default function Control({ children, disabled, ...rest }: Props) {
  return (
    <Center
      bg={'gray.300'}
      rounded="8px"
      p="12px"
      transition="80ms linear all"
      cursor={disabled ? 'normal' : 'pointer'}
      opacity={disabled ? '0.7' : '1'}
      _hover={
        disabled
          ? {}
          : {
              bg: 'gray.200',
            }
      }
      {...rest}
    >
      {children}
    </Center>
  )
}
