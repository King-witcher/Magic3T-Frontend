import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
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

type AuthData = {
  signIn(): Promise<string | null>
  signOut(): Promise<string | null>
} & (
  | {
      user: null
      logged: false
      firstLoading: boolean
      getToken: null
    }
  | {
      logged: true
      firstLoading: false
      user: User
      getToken(): Promise<string | null>
    }
)

interface Props {
  children?: ReactNode
}

const AuthContext = createContext<AuthData>({} as AuthData)

export function AuthProvider({ children }: Props) {
  const [firstLoading, setFirstLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const logged = !!user

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
      setFirstLoading(false)
    })
  }, [])

  return (
    <AuthContext.Provider
      value={
        {
          firstLoading,
          logged,
          getToken,
          signIn,
          signOut,
          user,
        } as unknown as AuthData
      }
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
