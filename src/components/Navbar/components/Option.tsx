import { Flex, FlexProps } from '@chakra-ui/react'

interface Props extends FlexProps {
  label: string
  icon: string
}

export default function Option({ label, icon, ...rest }: Props) {
  return (
    <Flex
      w="100%"
      h="40px"
      alignItems="center"
      borderRadius="5px"
      px="20px"
      userSelect="none"
      cursor="pointer"
      color="pink.800"
      _hover={{
        bg: 'pink.200',
      }}
      justifyContent="space-between"
      {...rest}
    >
      {label}
    </Flex>
  )
}
