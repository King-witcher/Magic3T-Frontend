import { useServiceStatus } from '@/contexts/ServiceStatusContext'
import { Center, Heading, Text } from '@chakra-ui/react'

export function ServicesOffline() {
  const { serverOnline } = useServiceStatus()

  return serverOnline === false ? (
    <Center w="100%" h="100%">
      Servidor indisponível.
    </Center>
  ) : (
    <Center flexDir="column" w="100%" h="100%">
      <Heading>Aguarde enquanto religamos o servidor...</Heading>
      <Text>
        O servidor do Magic3t é desligado automaticamente quando inativo para
        reduzir gastos, mas já iniciamos o processo de religamento. Esse
        processo leva cerca de 2 a 3 minutos e te avisaremos quando tudo estiver
        pronto.
      </Text>
    </Center>
  )
}
