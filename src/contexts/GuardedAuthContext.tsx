import { UserData } from '@/models/users/User'
import { ReactNode, createContext, useContext } from 'react'
import { AuthState } from './AuthContext'

// GuardedAuth Context - Provied by auth guard and guarantees that the user is not null and the state is signed in

interface GuardedAuthData {
  user: UserData
  authState: AuthState.SignedIn
  signOut(): Promise<void>
  getToken(): Promise<string>
}

interface Props {
  children?: ReactNode
  user: UserData
  signOut(): Promise<void>
  getToken(): Promise<string>
}

const GuardedAuthContext = createContext<GuardedAuthData>({} as GuardedAuthData)

export function GuardedAuthProvider({ children, ...rest }: Props) {
  return (
    <GuardedAuthContext.Provider
      value={{ authState: AuthState.SignedIn, ...rest }}
    >
      {children}
    </GuardedAuthContext.Provider>
  )
}

export const useGuardedAuth = () => useContext(GuardedAuthContext)
