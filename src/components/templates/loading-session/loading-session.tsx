import { Center, Spinner, Text, VStack } from '@chakra-ui/react'

export function LoadingSessionTemplate() {
  return (
    <Center h="100%">
      <VStack spacing={0} p="20px 30px" rounded="10px">
        <Spinner size="xl" thickness="5px" color="light" speed="666ms" />
        <Text fontSize="18px" color="light" fontWeight={600} mt="10px">
          Loading session
        </Text>
        <Text fontSize="14px" color="#ffffffc0" fontWeight={600}>
          If nothing shows up shortly, refresh the page.
        </Text>
      </VStack>
    </Center>
  )
}
