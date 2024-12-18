import { AuthState, useAuth } from '@/contexts/auth.context.tsx'
import {
  Button,
  Center,
  Flex,
  Heading,
  Input,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Link, Navigate } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { RiGoogleFill } from 'react-icons/ri'

interface FormData {
  email: string
  password: string
  checkPassword: string
}

interface Props {
  referrer?: string
}

export function RegisterTemplate({ referrer = '/' }: Props) {
  const { authState, signInGoogle, registerEmail } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [waiting, setWaiting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const errorMap: Record<string, string> = {
    'auth/email-already-in-use': 'Já existe uma conta com o este email.',
    'auth/invalid-email': 'Email inválido',
    'auth/weak-password': 'Senha muito fraca',
  }

  const handleRegister = useCallback(
    async ({ email, password, checkPassword }: FormData) => {
      if (password !== checkPassword) {
        return
      }
      setWaiting(true)
      const error = await registerEmail(email, password)
      console.error(error)
      if (error) setError(errorMap[error] || 'Erro desconhecido')
      setWaiting(false)
    },
    []
  )

  if (authState === AuthState.Loading || authState === AuthState.SignedIn)
    return (
      <Center h="100%">
        {authState === AuthState.SignedIn && <Navigate to={referrer} />}
        <Spinner size="lg" thickness="4px" color="blue.500" speed="0.8s" />
      </Center>
    )

  return (
    <Center h="full">
      <VStack
        as="form"
        p="20px"
        justifyContent="center"
        alignItems="center"
        onSubmit={handleSubmit(handleRegister)}
        w="full"
        bg="#ffffff30"
        rounded="10px"
        spacing="10px"
        border="solid 1px #ffffff40"
        boxShadow="0 0 40px 0 #00000040"
        maxW={{ base: 'auto', sm: '400px' }}
      >
        <Heading lineHeight="3.125rem">Register</Heading>
        <Input
          variant="form"
          placeholder="Email"
          isDisabled={waiting}
          type="email"
          {...register('email', { required: true })}
          {...(errors.email
            ? {
                borderColor: '#ff4040',
                boxShadow: 'inset 0 0 5px 0 #ff4040',
              }
            : {})}
        />
        <Input
          variant="form"
          placeholder="Password"
          isDisabled={waiting}
          type="password"
          {...register('password', { required: true })}
          {...(errors.password
            ? {
                borderColor: '#ff4040',
                boxShadow: 'inset 0 0 5px 0 #ff4040',
              }
            : {})}
        />
        <Input
          variant="form"
          placeholder="Check password"
          isDisabled={waiting}
          {...register('checkPassword', { required: true })}
          type="password"
          {...(errors.checkPassword
            ? {
                borderColor: '#ff4040',
                boxShadow: 'inset 0 0 5px 0 #ff4040',
              }
            : {})}
        />
        <VStack w="full" gap="0">
          <Button
            variant="submitForm"
            type="submit"
            w="full"
            isDisabled={waiting}
            onClick={handleSubmit(handleRegister)}
          >
            {waiting ? (
              <Spinner size="sm" speed="1s" thickness="3px" />
            ) : (
              'Submit'
            )}
          </Button>
          {error && <Text color="#ff4000">{error}</Text>}
        </VStack>
        <Link to={referrer ? `/sign-in?referrer=${referrer}` : '/sign-in'}>
          <Text color="#9cabff">Already have an account</Text>
        </Link>

        <Text>or</Text>

        <Button size="lg" w="full" variant="submitForm" onClick={signInGoogle}>
          <Flex gap="10px" alignItems="center">
            <RiGoogleFill size="24px" />
            Sign-in with Gogle
          </Flex>
        </Button>
      </VStack>
    </Center>
  )
}
