import { AuthState, useAuth } from '@/contexts/auth.context.tsx'
import { auth } from '@/services/firebase'
import { isValidEmail } from '@/utils/isValidEmail'
import {
  Button,
  Center,
  Flex,
  Heading,
  Input,
  Spinner,
  Text,
  VStack,
  chakra,
} from '@chakra-ui/react'
import { Link, Navigate } from '@tanstack/react-router'
import { AuthErrorCodes, sendPasswordResetEmail } from 'firebase/auth'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { RiGoogleFill } from 'react-icons/ri'
import { LoadingSessionTemplate } from '../loading-session'

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
      if (error === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS) {
        setError('Invalid credentials')
      }
      setWaiting(false)
    },
    [signInEmail]
  )

  const handleRecover = useCallback(async () => {
    if (!isValidEmail(email)) {
      setFormError('email', {})
      setError('Invalid email')
      return
    }

    setError(null)
    clearErrors()
    setHideResetPassword(true)
    setTimeout(() => setHideResetPassword(false), 5000)
    await sendPasswordResetEmail(auth, email)
  }, [email, setFormError])

  if (authState === AuthState.Loading || authState === AuthState.SignedIn) {
    return (
      <>
        {authState === AuthState.SignedIn && <Navigate to={referrer} />}
        <LoadingSessionTemplate />
      </>
    )
  }

  return (
    <Center flex="1" boxSizing="border-box" w="full" h="full">
      <VStack
        as="form"
        p="40px"
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
        <Text textAlign="center">
          Don&apos;t have an account yet?{' '}
          <Link to="/register" search={(prev) => ({ referrer: prev.referrer })}>
            <chakra.span color="#9cabff">Create one</chakra.span>
          </Link>
        </Text>{' '}
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
        {hideResetPassword ? (
          <Text color="#9cabff">Recovery email sent</Text>
        ) : (
          <Text color="#9cabff" onClick={handleRecover} cursor="pointer">
            Forgot password?
          </Text>
        )}
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
