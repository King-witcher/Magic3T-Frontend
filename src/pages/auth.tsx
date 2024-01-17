import SignInPage from '@/components/SignInPage'
import { AuthState, useAuth } from '@/contexts/AuthContext'
import {
  Center,
  Spinner,
  VStack,
  Text,
  Modal,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react'
import { ReactNode, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

export default function AuthMiddleware() {
  const { user, authState } = useAuth()

  const navigate = useNavigate()

  useEffect(() => {
    const path = window.location.pathname
    if (authState === AuthState.NotSignedIn)
      navigate(
        path === '/'
          ? 'sign-in'
          : `/sign-in?referrer=${window.location.pathname}`,
      )
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

  return <Outlet />
}
