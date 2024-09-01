import { AuthState, useAuth } from '@/contexts/auth.context.tsx'
import { auth } from '@/services/firebase'
import { isValidEmail } from '@/utils/isValidEmail'
import {
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Input,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Link, useNavigate } from '@tanstack/react-router'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FcGoogle } from 'react-icons/fc'

interface Props {
  referrer?: string
}

/** Handles the process of loading the auth state and requiring login, if the user is not signed in. */
export function SignInTemplate({ referrer = '/' }: Props) {
  const { authState, signInGoogle, signInEmail } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [hideResetPassword, setHideResetPassword] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const navigate = useNavigate({
    from: '/sign-in',
  })

  const {
    register,
    handleSubmit,
    setError: setFormError,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const email = watch('email')

  const handleSignIn = useCallback(
    async (data: { email: string; password: string }) => {
      setWaiting(true)
      const error = await signInEmail(data.email, data.password)
      if (error === 'auth/invalid-login-credentials') {
        setError('Credenciais inválidas')
      }
      setWaiting(false)
    },
    [signInEmail]
  )

  const handleRecover = useCallback(async () => {
    if (!isValidEmail(email)) {
      setFormError('email', {})
      setError('Email inválido')
      return
    }

    setHideResetPassword(true)
    setTimeout(() => setHideResetPassword(false), 5000)
    await sendPasswordResetEmail(auth, email)
  }, [email, setFormError])

  useEffect(() => {
    if (authState === AuthState.SignedIn) navigate(referrer)
  }, [authState, navigate, referrer])

  if (authState === AuthState.Loading || authState === AuthState.SignedIn)
    return (
      <Center h="100%">
        <Spinner size="lg" thickness="4px" color="blue.500" speed="0.8s" />
      </Center>
    )

  return (
    <VStack
      h="100%"
      justifyContent="center"
      gap="10px"
      flexDir={{ base: 'column', lg: 'row' }}
    >
      <Center
        flex="1"
        fontSize={['60px', '80px', '120px']}
        fontWeight="700"
        color="blue.500"
      >
        Magic3T
      </Center>
      <Divider hideBelow="lg" orientation="vertical" />
      <Center flex="1" boxSizing="border-box" w="full">
        <VStack
          as="form"
          justifyContent="center"
          alignItems="center"
          onSubmit={handleSubmit(handleSignIn)}
          w="full"
          maxW={{ base: 'auto', sm: '400px' }}
        >
          <Heading>Entrar</Heading>
          <Input
            variant="form"
            placeholder="Email"
            {...register('email', { required: true })}
            type="email"
            isDisabled={waiting}
            {...(errors.email
              ? { borderColor: 'red.400', borderWidth: '1px 1px 1px 5px' }
              : {})}
          />
          <Input
            variant="form"
            placeholder="Senha"
            {...register('password', { required: true })}
            type="password"
            isDisabled={waiting}
            {...(errors.password
              ? { borderColor: 'red.400', borderWidth: '1px 1px 1px 5px' }
              : {})}
          />
          <VStack w="full" gap="0">
            <Button
              variant="submitForm"
              type="submit"
              w="full"
              isDisabled={waiting}
            >
              {waiting ? (
                <Spinner size="sm" speed="1s" thickness="3px" />
              ) : (
                'Entrar'
              )}
            </Button>

            {error && <Text color="red.400">{error}</Text>}
          </VStack>
          <Flex gap="10px">
            <Link
              to={referrer ? `/register?referrer=${referrer}` : '/register'}
            >
              <Text color="blue.500">Criar conta</Text>
            </Link>{' '}
            -
            {hideResetPassword ? (
              <Text color="blue.500">Email de recuperação enviado</Text>
            ) : (
              <Text color="blue.500" onClick={handleRecover} cursor="pointer">
                Recuperar senha
              </Text>
            )}
          </Flex>

          <Text>ou</Text>

          <Button size="lg" w="full" onClick={signInGoogle}>
            <Flex gap="10px" alignItems="center">
              <FcGoogle size="24px" />
              Continuar com Google
            </Flex>
          </Button>
          {/* <Flex
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
        </Flex> */}
        </VStack>
      </Center>
    </VStack>
  )
}
