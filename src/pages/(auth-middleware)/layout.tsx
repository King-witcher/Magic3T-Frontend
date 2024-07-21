import { AuthState, useAuth } from '@/contexts/auth.context.tsx'
import { GuardedAuthProvider } from '@/contexts/guarded-auth.context.tsx'
import { Center, Spinner, Text, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import GuardedProviders from './guarded-providers.tsx'

export default function AuthMiddleware() {
  const { user, authState, getToken, signOut } = useAuth()

  const navigate = useNavigate()

  useEffect(() => {
    const path = window.location.pathname
    if (authState === AuthState.NotSignedIn)
      navigate(path === '/' ? '/sign-in' : `/sign-in?referrer=${path}`)
  }, [authState])

  if (authState === AuthState.Loading || authState === AuthState.NotSignedIn) {
    return (
      <Center h="100%">
        <VStack gap="10px" p="20px 30px" rounded="10px">
          <Spinner size="xl" thickness="5px" color="blue.500" speed="1.5s" />
          <Text fontSize="18px" color="blue.700" fontWeight={600}>
            Carregando sessão
          </Text>
        </VStack>
      </Center>
    )
  }

  return (
    <GuardedAuthProvider user={user} getToken={getToken} signOut={signOut}>
      <GuardedProviders>
        <Outlet />
      </GuardedProviders>
    </GuardedAuthProvider>
  )
}
