import { models } from '@/models'
import type { UserData } from '@/models/users/user'
import { auth, provider } from '@/services/firebase'
import {
  type User,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  getIdToken,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import type { Unsubscribe } from 'firebase/firestore'
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

export enum AuthState {
  NotSignedIn = 0,
  Loading = 1,
  SignedIn = 2,
}

type AuthData = {
  signInGoogle(): Promise<void>
  signInEmail(email: string, password: string): Promise<string | null>
  registerEmail(email: string, password: string): Promise<string | null>
  getToken(): Promise<string>
  signOut(): Promise<void>
} & (
  | {
      user: null
      authState: AuthState.NotSignedIn
    }
  | {
      user: null
      authState: AuthState.Loading
    }
  | {
      user: UserData
      authState: AuthState.SignedIn
    }
)

interface Props {
  children?: ReactNode
}

const AuthContext = createContext<AuthData>({} as AuthData)

export function AuthProvider({ children }: Props) {
  const [authData, setAuthData] = useState<User | null>(null)
  const [authState, setAuthState] = useState(AuthState.Loading)
  const [user, setUser] = useState<UserData | null>(null)

  const signInGoogle = useCallback(async () => {
    try {
      // states will be changed by onAuthStateChanged method
      await signInWithPopup(auth, provider)
      setAuthState(AuthState.Loading)
    } catch (e) {
      console.error(e)
      if (import.meta.env.DEV) alert(e)
    } finally {
      setAuthState(AuthState.NotSignedIn)
    }
  }, [])

  const signInEmail = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      try {
        await signInWithEmailAndPassword(auth, email, password)
      } catch (e: unknown) {
        import.meta.env.DEV && alert(e)
      } finally {
        setAuthState(AuthState.NotSignedIn)
      }
      return null
    },
    []
  )

  const registerEmail = useCallback(async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (e: unknown) {
      import.meta.env.DEV && alert(e)
    } finally {
      setAuthState(AuthState.NotSignedIn)
    }
  }, [])

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth)
  }, [])

  const getToken = useCallback(async () => {
    if (authData) {
      return await getIdToken(authData, true)
    }
    throw new Error('No user connected')
  }, [authData])

  const handleUserSnapshot = useCallback((user: UserData | null) => {
    if (!user) {
      console.error('Bad user')
    } else {
      setUser(user)
      setAuthState(AuthState.SignedIn)
    }
  }, [])

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null
    return onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        unsubscribe = models.users.subscribe(authUser.uid, handleUserSnapshot)
      } else {
        unsubscribe?.()
        setUser(null)
        setAuthState(AuthState.NotSignedIn)
      }
      setAuthData(authUser)
    })
  }, [user?._id])

  return (
    <AuthContext.Provider
      value={
        {
          authState,
          user,
          getToken,
          signInGoogle,
          signInEmail,
          registerEmail,
          signOut,
        } as unknown as AuthData
      }
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
