import { AuthState, useAuth } from '@/contexts/auth.context.tsx'
import { useQueryParams } from '@/hooks/useQueryParams'
import {
  Button,
  Center,
  Heading,
  Input,
  VStack,
  Text,
  Flex,
  Spinner,
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FcGoogle } from 'react-icons/fc'
import { Link, useNavigate } from 'react-router-dom'

interface FormData {
  email: string
  password: string
  checkPassword: string
}

export default function RegisterPage() {
  const { authState, signInGoogle, signInEmail, registerEmail } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [waiting, setWaiting] = useState(false)
  const params = useQueryParams()
  const referrer = params.get('referrer') || '/'
  const navigate = useNavigate()

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
    [],
  )

  useEffect(() => {
    if (authState === AuthState.SignedIn) navigate(referrer)
  }, [authState])

  if (authState === AuthState.Loading || authState === AuthState.SignedIn)
    return (
      <Center h="100%">
        <Spinner size="lg" thickness="4px" color="blue.500" speed="0.8s" />
      </Center>
    )

  return (
    <Center h="full">
      <VStack
        as="form"
        justifyContent="center"
        alignItems="center"
        onSubmit={handleSubmit(handleRegister)}
        w="full"
        maxW={{ base: 'auto', sm: '400px' }}
      >
        <Heading>Criar conta</Heading>
        <Input
          variant="form"
          placeholder="Email"
          isDisabled={waiting}
          type="email"
          {...register('email', { required: true })}
          {...(errors.email
            ? { borderColor: 'red.400', borderWidth: '1px 1px 1px 5px' }
            : {})}
        />
        <Input
          variant="form"
          placeholder="Senha"
          isDisabled={waiting}
          type="password"
          {...register('password', { required: true })}
          {...(errors.password
            ? { borderColor: 'red.400', borderWidth: '1px 1px 1px 5px' }
            : {})}
        />
        <Input
          variant="form"
          placeholder="Confirmar senha"
          isDisabled={waiting}
          {...register('checkPassword', { required: true })}
          type="password"
          {...(errors.checkPassword
            ? { borderColor: 'red.400', borderWidth: '1px 1px 1px 5px' }
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
              'Registrar'
            )}
          </Button>
          {error && <Text color="red.400">{error}</Text>}
        </VStack>
        <Link to={referrer ? `/sign-in?referrer=${referrer}` : '/sign-in'}>
          <Text color="blue.500">Tenho uma conta</Text>
        </Link>

        <Text>ou</Text>

        <Button size="lg" w="full" onClick={signInGoogle}>
          <Flex gap="10px" alignItems="center">
            <FcGoogle size="24px" />
            Continuar com Google
          </Flex>
        </Button>
      </VStack>
    </Center>
  )
}
