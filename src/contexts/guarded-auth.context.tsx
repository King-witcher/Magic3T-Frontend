import { addCommand } from '@/components/organisms'
import { Profile } from '@magic3t/types'
import { type ReactNode, createContext, useContext, useEffect } from 'react'
import { AuthState } from './auth.context'

// GuardedAuth Context - Provided by auth guard and guarantees that the user is not null and the state is signed in

interface GuardedAuthData {
  user: Profile
  authState: AuthState.SignedIn
  signOut(): Promise<void>
  getToken(): Promise<string>
}

interface Props {
  user: Profile
  children?: ReactNode
  signOut(): Promise<void>
  getToken(): Promise<string>
}

const GuardedAuthContext = createContext<GuardedAuthData>({} as GuardedAuthData)

export function GuardedAuthProvider({ children, ...rest }: Props) {
  useEffect(() => {
    return addCommand('gentoken', async (args, ctx) => {
      ctx.log('Generating token...')
      const token = await rest.getToken()
      ctx.log(token)
    })
  }, [rest.getToken])

  return (
    <GuardedAuthContext.Provider
      value={{ authState: AuthState.SignedIn, ...rest }}
    >
      {children}
    </GuardedAuthContext.Provider>
  )
}

export const useGuardedAuth = () => useContext(GuardedAuthContext)
