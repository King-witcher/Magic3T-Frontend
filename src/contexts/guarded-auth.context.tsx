import { setCommand } from '@/lib/Commands.ts'
import { UserDto } from '@/services/nest-api/dtos.ts'
import { type ReactNode, createContext, useContext, useEffect } from 'react'
import { AuthState } from './auth.context.tsx'

// GuardedAuth Context - Provided by auth guard and guarantees that the user is not null and the state is signed in

interface GuardedAuthData {
  user: UserDto
  authState: AuthState.SignedIn
  signOut(): Promise<void>
  getToken(): Promise<string>
}

interface Props {
  children?: ReactNode
  user: UserDto
  signOut(): Promise<void>
  getToken(): Promise<string>
}

const GuardedAuthContext = createContext<GuardedAuthData>({} as GuardedAuthData)

export function GuardedAuthProvider({ children, ...rest }: Props) {
  useEffect(() => {
    return setCommand('get-token', async () => {
      const token = await rest.getToken()
      console.log(token)
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
