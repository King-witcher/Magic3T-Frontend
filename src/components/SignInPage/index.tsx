import { useAuth } from '@/contexts/AuthContext'
import { Center, Flex, Spinner, Stack, Text, VStack } from '@chakra-ui/react'
import { FaEnvelope, FaRegFaceSadCry } from 'react-icons/fa6'
import { FcGoogle } from 'react-icons/fc'

/** Handles the process of loading the auth state and requiring login, if the user is not signed in. */
export default function SignInPage() {
  const { loading: firstLoading, signInGoogle, signInEmail } = useAuth()

  if (firstLoading)
    return (
      <Center h="100%">
        <Spinner size="lg" thickness="4px" color="blue.500" speed="0.8s" />
      </Center>
    )
  else
    return (
      <VStack h="100%" justifyContent="center" gap={['20px', '30px', '40px']}>
        <Text
          fontSize={['60px', '80px', '120px']}
          fontWeight="700"
          color="blue.500"
        >
          Magic3T
        </Text>
        <Stack>
          <Flex
            fontSize={['20px', '32px']}
            alignItems="center"
            bgColor="gray.100"
            p={['5px 10px', '10px 20px']}
            borderRadius={['10px', '20px']}
            _hover={{ bg: 'gray.50' }}
            gap="10px"
            userSelect="none"
            cursor="pointer"
            onClick={signInGoogle}
          >
            <FcGoogle />
            <Text fontSize={['16px', '24px']}>Entrar com Google</Text>
          </Flex>
          <Flex
            fontSize={['20px', '32px']}
            alignItems="center"
            bgColor="gray.100"
            p={['5px 10px', '10px 20px']}
            borderRadius={['10px', '20px']}
            _hover={{ bg: 'gray.50' }}
            gap="10px"
            userSelect="none"
            cursor="pointer"
            onClick={signInEmail}
          >
            <FaEnvelope />
            <Text fontSize={['16px', '24px']}>Entrar com email</Text>
          </Flex>
        </Stack>
      </VStack>
    )
}
