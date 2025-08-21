import { Console } from '@/lib/console'
import { type ReactNode, createContext, useContext, useEffect } from 'react'
import { AuthState } from './auth.context'
import { UserPayload } from '@magic3t/types'

// GuardedAuth Context - Provided by auth guard and guarantees that the user is not null and the state is signed in

interface GuardedAuthData {
  user: UserPayload
  authState: AuthState.SignedIn
  signOut(): Promise<void>
  getToken(): Promise<string>
}

interface Props {
  user: UserPayload
  children?: ReactNode
  signOut(): Promise<void>
  getToken(): Promise<string>
}

const GuardedAuthContext = createContext<GuardedAuthData>({} as GuardedAuthData)

export function GuardedAuthProvider({ children, ...rest }: Props) {
  useEffect(() => {
    return Console.addCommand('gentoken', async () => {
      Console.log('Generating token...')
      const token = await rest.getToken()
      Console.log(token)
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
