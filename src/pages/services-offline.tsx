import { useServiceStatus } from '@/contexts/ServiceStatusContext'
import { Box, Center, Heading, Text, VStack } from '@chakra-ui/react'

export function ServicesOffline() {
  const { serverOnline } = useServiceStatus()

  return serverOnline === false ? (
    <Center w="100%" h="100%">
      Servidor de jogo indisponível.
    </Center>
  ) : (
    <Center flexDir="column" w="100%" h="100%">
      <VStack maxW="600px" gap="20px">
        <Heading textAlign="center">
          Aguarde enquanto religamos o servidor...
        </Heading>
        <Center textAlign="center">
          O servidor do Magic3t é desligado automaticamente quando inativo para
          reduzir gastos, mas já iniciamos o processo de religamento. Esse
          processo leva cerca de 2 a 3 minutos e te avisaremos quando tudo
          estiver pronto.
        </Center>
      </VStack>
    </Center>
  )
}
