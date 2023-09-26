import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Api, SessionRequests } from '@/lib/api'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useServiceStatus } from './ServiceStatusContext'

interface AuthData {
  isLoading: boolean
  isLogged: boolean
  token: string | null
  signIn(username: string, password: string): Promise<void>
  signOut(): Promise<void>
}

interface Props {
  children?: ReactNode
}

const AuthContext = createContext<AuthData>({} as AuthData)

export function AuthProvider({ children }: Props) {
  const { serverOnline } = useServiceStatus()
  const [isLoading, setIsLoading] = useState(true)
  const [isLogged, setIsLogged] = useState(false)
  const [token, setToken] = useLocalStorage<string | null>('sessionToken', null)

  async function validateSessionToken() {
    if (!serverOnline) return
    if (token) {
      const data = await SessionRequests.validateSession(token)
      if (!data.data.authenticated) {
        setToken(null)
        setIsLoading(false)
        setIsLogged(false)
      }
    }
  }

  async function signIn(username: string, password: string) {}

  async function signOut() {}

  useEffect(() => {
    validateSessionToken()
  }, [serverOnline])

  return (
    <AuthContext.Provider
      value={{ isLoading, isLogged, token, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
