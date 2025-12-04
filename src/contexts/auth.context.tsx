import { Console } from '@/lib/console'
import { auth, provider } from '@/services/firebase'
import { NestApi } from '@/services/nest-api'
import { UserPayload } from '@magic3t/types'
import { useQuery } from '@tanstack/react-query'
import {
  type User as FirebaseUser,
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
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

export enum AuthState {
  NotSignedIn = 'not-signed-in',
  Loading = 'loading',
  SignedIn = 'signed-in',
}

type AuthData =
  | null
  | ({
      signInGoogle(): Promise<void>
      signInEmail(email: string, password: string): Promise<string | null>
      registerEmail(email: string, password: string): Promise<string | null>
      refreshUser(): Promise<void>
      getToken(): Promise<string>
      signOut(): Promise<void>
    } & (
      | {
          user: null
          userId: null
          authState: AuthState.NotSignedIn
        }
      | {
          user: null
          userId: null
          authState: AuthState.Loading
        }
      | {
          user: UserPayload | null
          userId: string
          authState: AuthState.SignedIn
        }
    ))

interface Props {
  children?: ReactNode
}

const AuthContext = createContext<AuthData>(null)

export function AuthProvider({ children }: Props) {
  const [authData, setAuthData] = useState<FirebaseUser | null>(null)
  const [authState, setAuthState] = useState(AuthState.Loading)

  const userQuery = useQuery({
    queryKey: ['myself', authData?.uid],
    staleTime: Number.POSITIVE_INFINITY,
    async queryFn() {
      if (!authData) return null
      const user = await NestApi.User.getById(authData.uid)
      setAuthState(AuthState.SignedIn) // Smell
      return user
    },
  })

  const signInGoogle = useCallback(async () => {
    try {
      // states will be changed by onAuthStateChanged method
      await signInWithPopup(auth, provider)
      setAuthState(AuthState.Loading)
    } catch (e) {
      console.error(e)
      Console.log((e as unknown as Error).message)
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

  // Syncs authData with firebase
  useEffect(() => {
    return onAuthStateChanged(auth, async (authData) => {
      import.meta.env.DEV && Console.log(`Detected auth state '${authState}'`)
      setAuthData(authData)
      if (!authData) {
        // setUser(null)
        setAuthState(AuthState.NotSignedIn)
      }
    })
  }, [])

  useEffect(
    function declareGentoken() {
      if (authState !== AuthState.SignedIn) return
      return Console.addCommand({
        name: 'gentoken',
        description: 'Generates and prints your authentication token',
        async handler(ctx) {
          ctx.console.print('Generating token')
          const token = await getToken()
          ctx.console.print(token)
          return 0
        },
      })
    },
    [getToken, authState]
  )

  const contextValue = useMemo(
    () =>
      ({
        authState,
        user: userQuery.data,
        userId: authData?.uid,
        getToken,
        signInGoogle,
        signInEmail,
        refreshUser: async () => {
          await userQuery.refetch()
        },
        registerEmail,
        signOut,
      }) as unknown as AuthData,
    [
      authState,
      userQuery.data,
      getToken,
      signInGoogle,
      signInEmail,
      registerEmail,
      userQuery.refetch,
      signOut,
    ]
  )

  return <AuthContext value={contextValue}>{children}</AuthContext>
}

export function useAuth() {
  const authData = use(AuthContext)
  if (authData === null)
    throw new Error('Used auth context outside <AuthProvider>')
  return authData
}

export function useUser() {
  const auth = useAuth()
  if (auth.user === null)
    throw new Error('Used useUser while user is not defined')
  return auth.user
}
