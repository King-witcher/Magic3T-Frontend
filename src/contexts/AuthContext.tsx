import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Api, SessionRequests } from '@/services/api'
import {
  ReactNode,
  createContext,
  useCallback,
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
  getIdToken,
} from 'firebase/auth'
import { auth, provider } from '@/services/firebase'
import { getId } from 'firebase/installations'

interface AuthData {
  isLoading: boolean
  isLogged: boolean
  getToken(): Promise<string | null>
  signIn(): Promise<void>
  signOut(): Promise<void>
  user: User | null
}

interface Props {
  children?: ReactNode
}

const AuthContext = createContext<AuthData>({} as AuthData)

export function AuthProvider({ children }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [isLogged, setIsLogged] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const signIn = useCallback(async () => {
    await signInWithPopup(auth, provider)
  }, [])

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth)
  }, [])

  const getToken = useCallback(async () => {
    if (user) {
      const token = await getIdToken(user, true)
      return token
    } else throw new Error('No user connected')
  }, [user])

  useEffect(() => {
    console.log('render here')
    return onAuthStateChanged(auth, (user) => {
      console.log('setting user', user)
      setUser(user)
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isLogged,
        getToken,
        signIn,
        signOut,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
