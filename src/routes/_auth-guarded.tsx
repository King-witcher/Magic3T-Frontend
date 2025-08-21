import {
  ChooseNicknameTemplate,
  LoadingSessionTemplate,
} from '@/components/templates'
import { AuthState, useAuth } from '@/contexts/auth.context'
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/_auth-guarded')({
  component: () => {
    const { user, authState } = useAuth()

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

    return user ? <Outlet /> : <ChooseNicknameTemplate />
  },
})
