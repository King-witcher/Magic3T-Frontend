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
import { models } from '@/models'
import { UserData } from '@/models/users/User'
import { Unsubscribe } from 'firebase/firestore'

type AuthData = {
  signIn(): Promise<string | null>
  signOut(): Promise<string | null>
  getToken(): Promise<string | null>
} & (
  | {
      user: null
      logged: false
      loading: boolean
    }
  | {
      user: UserData
      logged: true
      loading: false
    }
)

interface Props {
  children?: ReactNode
}

const AuthContext = createContext<AuthData>({} as AuthData)

export function AuthProvider({ children }: Props) {
  const [loading, setLoading] = useState(true)
  const [authData, setAuthData] = useState<User | null>(null)
  const [user, setUser] = useState<UserData | null>(null)
  const logged = !!authData

  const signIn = useCallback(async () => {
    try {
      // states will be changed by onAuthStateChanged method
      await signInWithPopup(auth, provider)
    } catch (e) {
      console.error(e)
      setLoading(false)
      if (import.meta.env.DEV) alert(e)
    }
  }, [])

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth)
  }, [])

  const getToken = useCallback(async () => {
    if (authData) {
      const token = await getIdToken(authData, true)
      return token
    } else throw new Error('No user connected')
  }, [authData])

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        unsubscribe = models.users.subscribe(user.uid, setUser)
      } else {
        unsubscribe && unsubscribe()
        setUser(null)
      }
      setAuthData(user)
      setLoading(false)
    })
  }, [])

  return (
    <AuthContext.Provider
      value={
        {
          loading,
          logged,
          user,
          getToken,
          signIn,
          signOut,
        } as unknown as AuthData
      }
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
