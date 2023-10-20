import { Box, Divider, Heading, Text } from '@chakra-ui/react'
import ChoiceComponent from '../game/[gameId]/components/ChoiceComponent'
import Choice from './Choice'

export default function TutorialPage() {
  return (
    <Box h="100%" p="20px">
      <Heading>Como jogar Magic3T</Heading>
      <Divider />
      <Text fontSize={['16px', '20px']} textIndent="20px" mt="15px">
        Magic3T é um jogo de 1 contra 1, de escolha única de números e em
        turnos. Em outras palavras, o jogo começa com uma tabela contendo todos
        os inteiros de 1 a 9. Em cada turno, um jogador pode retirar um número
        da tabela principal, trazendo para o seu conjunto de escolhas. O
        objetivo é extremamente simples: você precisa que, entre todos os
        números escolhidos, exista algum subconjunto de <b>três</b> cuja soma
        seja igual a <b>15</b>, antes que o seu oponente o faça.
      </Text>
      <Text fontSize={['16px', '20px']} textIndent="20px" mt="15px">
        Por exemplo, vamos supor que você tenha em mãos os números{' '}
        <Choice choice={1} />, <Choice choice={9} /> e <Choice choice={6} />.
        Apesar de <Choice choice={9} /> + <Choice choice={6} /> resultar em 15,
        você ainda não venceu, porque precisamos que sejam três números. No
        entanto, se no próximo turno você consegue escolher o número{' '}
        <Choice choice={5} />, o trio <Choice choice={1} />,{' '}
        <Choice choice={5} /> e <Choice choice={9} /> automaticamente ficará em
        destaque no seu conjunto e você vencerá a partida.
      </Text>
      <Text fontSize={['16px', '20px']} textIndent="20px" pt="15px">
        Caso todas as opções se esgotem, e nenhum dos dois tenha um trio
        vencedor, a partida é encerrada com um empate.
      </Text>
      <Heading as="h3" fontSize="28px" mt="15px">
        Bloqueando jogadas
      </Heading>
      <Text fontSize={['16px', '20px']} textIndent="20px" mt="15px">
        Note que, ao mesmo tempo que você busca formar um trio vencedor para si,
        você também deve tentar prejudicar o seu oponente e impedir que ele
        forme os próprios trios, roubando os números de que ele precisa para
        vencer. Na partida acima, por exemplo, uma boa tentativa de fazer isso
        seria se o oponente tivesse escolhido o número <Choice choice={5} />, o
        que te impediria de escolhe-lo.
      </Text>
      <Heading as="h3" fontSize="28px" mt="15px">
        Cravadas
      </Heading>
      <Text fontSize={['16px', '20px']} textIndent="20px" mt="15px">
        Você pode não ter notado, mas o oponente realmente tentou te impedir de
        escolher um número! Ele havia escolhido o número <Choice choice={8} />{' '}
        para que você não vencesse com o trio <Choice choice={1} />,{' '}
        <Choice choice={6} /> e <Choice choice={8} />. Mas, como você foi mais
        esperto do que ele, era cheque-mate: existiam duas possibilidades que te
        fariam ganhar ao mesmo tempo e ele não poderia bloquear as duas ao mesmo
        tempo. Assim como no xadrez, chamamos isso de uma <b>cravada</b>, que é
        uma estratégia importante para vencer seu oponente de maneiras menos
        óbvias e evitar que ele sempre consiga te impedir.
      </Text>
      <Heading as="h3" fontSize="28px" mt="15px">
        Estratégia vencedora
      </Heading>
      <Text fontSize={['16px', '20px']} textIndent="20px" mt="15px">
        Apesar do número relativamente pequeno de possibilidades, o Magic3T não
        admite estratégia vencedora, ou seja: é impossível ganhar sempre, e dois
        jogadores suficientemente bons sempre encerrarão em empate.
      </Text>
    </Box>
  )
}
