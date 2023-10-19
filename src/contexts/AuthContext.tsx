import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  getIdToken,
} from 'firebase/auth'
import { auth, provider } from '@/services/firebase'

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
  const [user, setUser] = useState<User | null>(null)
  const isLogged = useMemo(() => !!user, [user])

  const signIn = useCallback(async () => {
    try {
      await signInWithPopup(auth, provider)
    } catch (e) {
      console.error(e)
      if (import.meta.env.DEV) alert(e)
    }
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
    return onAuthStateChanged(auth, (user) => {
      setUser(user)
      setIsLoading(false)
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
