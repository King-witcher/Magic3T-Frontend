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
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

export enum AuthState {
  NotSignedIn = 'not-signed-in',
  Loading = 'loading',
  SignedIn = 'signed-in',
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
      setAuthState(AuthState.NotSignedIn)
      if (import.meta.env.DEV) alert(e)
    }
  }, [])

  const signInEmail = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      try {
        await signInWithEmailAndPassword(auth, email, password)
        setAuthState(AuthState.Loading)
      } catch (e: unknown) {
        setAuthState(AuthState.NotSignedIn)
        import.meta.env.DEV && alert(e)
      }
      return null
    },
    []
  )

  const registerEmail = useCallback(async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      setAuthState(AuthState.Loading)
    } catch (e: unknown) {
      setAuthState(AuthState.NotSignedIn)
      import.meta.env.DEV && alert(e)
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
    import.meta.env.DEV && console.info('got user data', user)
    if (!user) {
      console.error('bad user')
    } else {
      setUser(user)
      setAuthState(AuthState.SignedIn)
    }
  }, [])

  // Syncs authData with firebase
  useEffect(() => {
    return onAuthStateChanged(auth, async (authData) => {
      import.meta.env.DEV && console.info('detected auth state', authData)
      setAuthData(authData)
      if (!authData) {
        setUser(null)
        setAuthState(AuthState.NotSignedIn)
      }
    })
  }, [])

  // Syncs the user data from the database with authData
  useEffect(() => {
    if (!authData) return () => null
    return models.users.subscribe(authData.uid, handleUserSnapshot)
  }, [authData, handleUserSnapshot])

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
