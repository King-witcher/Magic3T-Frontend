import {
  ChooseNicknameTemplate,
  LoadingSessionTemplate,
} from '@/components/templates'
import { AuthState, useAuth } from '@/contexts/auth.context'
import { GuardedAuthProvider } from '@/contexts/guarded-auth.context'
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

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
      return <LoadingSessionTemplate />
    }

    return (
      <GuardedAuthProvider user={user} getToken={getToken} signOut={signOut}>
        {user.identification ? <Outlet /> : <ChooseNicknameTemplate />}
      </GuardedAuthProvider>
    )
  },
})
