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
import { Link, Navigate } from '@tanstack/react-router'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FcGoogle } from 'react-icons/fc'
import { RiGoogleFill } from 'react-icons/ri'

interface Props {
  referrer?: string
}

/** Handles the process of loading the auth state and requiring login, if the user is not signed in. */
export function SignInTemplate({ referrer = '/' }: Props) {
  const { authState, signInGoogle, signInEmail } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [hideResetPassword, setHideResetPassword] = useState(false)
  const [waiting, setWaiting] = useState(false)

  const {
    register,
    handleSubmit,
    setError: setFormError,
    clearErrors,
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

    setError(null)
    clearErrors()
    setHideResetPassword(true)
    setTimeout(() => setHideResetPassword(false), 5000)
    await sendPasswordResetEmail(auth, email)
  }, [email, setFormError])

  if (authState === AuthState.Loading || authState === AuthState.SignedIn)
    return (
      <Center h="100%">
        {authState === AuthState.SignedIn && <Navigate to={referrer} />}
        <Spinner size="lg" thickness="4px" color="blue.500" speed="0.8s" />
      </Center>
    )

  return (
    <Center flex="1" boxSizing="border-box" w="full" h="full">
      <VStack
        as="form"
        p="20px"
        justifyContent="center"
        alignItems="center"
        onSubmit={handleSubmit(handleSignIn)}
        w="full"
        bg="#ffffff30"
        rounded="10px"
        spacing="10px"
        border="solid 1px #ffffff40"
        boxShadow="0 0 40px 0 #00000040"
        maxW={{ base: 'auto', sm: '400px' }}
      >
        <Heading lineHeight="3.125rem">Sign-in</Heading>
        <Input
          variant="form"
          placeholder="Email"
          {...register('email', { required: true })}
          type="email"
          isDisabled={waiting}
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
          {...register('password', { required: true })}
          type="password"
          isDisabled={waiting}
          {...(errors.password
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
          >
            {waiting ? (
              <Spinner size="sm" speed="1s" thickness="3px" />
            ) : (
              'Submit'
            )}
          </Button>

          {error && <Text color="#ff4000">{error}</Text>}
        </VStack>
        <Flex gap="10px">
          <Link to={referrer ? `/register?referrer=${referrer}` : '/register'}>
            <Text color="#9cabff">Create account</Text>
          </Link>{' '}
          -
          {hideResetPassword ? (
            <Text color="#9cabff">Recovery email sent</Text>
          ) : (
            <Text color="#9cabff" onClick={handleRecover} cursor="pointer">
              Recovery password
            </Text>
          )}
        </Flex>

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
