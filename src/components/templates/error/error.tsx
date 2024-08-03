import { Flex, Link, Text } from '@chakra-ui/react'
import { BiErrorAlt } from 'react-icons/bi'
import { Link as RouterDomLink } from 'react-router-dom'

export function ErrorTemplate() {
  return (
    <Flex h="full" align="center" justify="center" gap="10px" flexDir="column">
      <BiErrorAlt size="240px" />
      <Text size="20px" align="center">
        Um erro de execução impediu o Magic3T de mostrar esta página.
        <br />
        <Link as={RouterDomLink} to="/" fontWeight={700} color="blue.400">
          Retornar à página inicial
        </Link>
      </Text>
    </Flex>
  )
}
