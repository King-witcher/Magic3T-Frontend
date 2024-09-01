import { AuthState, useAuth } from '@/contexts/auth.context'
import { GuardedAuthProvider } from '@/contexts/guarded-auth.context'
import { Center, VStack, Text, Spinner } from '@chakra-ui/react'
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { GuardedProviders } from './-guarded-providers'

export const Route = createFileRoute('/_auth-guarded')({
  component: () => {
    const { user, authState, getToken, signOut } = useAuth()

    const navigate = useNavigate()

    useEffect(() => {
      const path = window.location.pathname
      if (authState === AuthState.NotSignedIn)
        navigate({
          to: '/sign-in',
          search:
            path === '/'
              ? undefined
              : {
                  referrer: path,
                },
        })
    }, [authState, navigate])

    if (
      authState === AuthState.Loading ||
      authState === AuthState.NotSignedIn
    ) {
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
  },
})
