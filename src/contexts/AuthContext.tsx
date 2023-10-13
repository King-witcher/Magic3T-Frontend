import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Api, SessionRequests } from '@/services/api'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useServiceStatus } from './ServiceStatusContext'
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth, provider } from '@/services/firebase'

interface AuthData {
  isLoading: boolean
  isLogged: boolean
  token: string | null
  signIn(): Promise<void>
  signOut(): Promise<void>
  user: User | null
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
  const [user, setUser] = useState<User | null>(null)

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

  async function signIn() {
    const credential = await signInWithPopup(auth, provider)
  }

  async function signOut() {
    firebaseSignOut(auth)
  }

  useEffect(() => {
    validateSessionToken()
  }, [serverOnline])

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
  })

  return (
    <AuthContext.Provider
      value={{ isLoading, isLogged, token, signIn, signOut, user }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
