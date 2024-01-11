import { Box, Center, Divider, Heading, Text } from '@chakra-ui/react'

export default function TutorialPage() {
  return (
    <Center>
      <Box h="100%" p="20px" maxW="800px">
        <Heading>Sistema de Ranking</Heading>
        <Divider />
        <Text fontSize={['16px', '20px']} textIndent="20px" mt="15px">
          Magic3T é um jogo de 1 contra 1, de escolha única de números e em
          turnos. Em outras palavras, o jogo começa com uma tabela contendo
          todos os inteiros de 1 a 9. Em cada turno, um jogador pode retirar um
          número da tabela principal, trazendo para o seu conjunto de escolhas.
          O objetivo é extremamente simples: você precisa que, entre todos os
          números escolhidos, exista algum subconjunto de <b>três</b> cuja soma
          seja igual a <b>15</b>, antes que o seu oponente o faça.
        </Text>
      </Box>
    </Center>
  )
}
