import { Spinner } from '@/components/atoms'
import { AuthState, useAuth } from '@/contexts/auth.context.tsx'
import { auth } from '@/services/firebase'
import buttonStyles from '@/styles/components/button.module.sass'
import inputStyles from '@/styles/components/input.module.sass'
import { isValidEmail } from '@/utils/isValidEmail'
import { Link, Navigate } from '@tanstack/react-router'
import { AuthErrorCodes, sendPasswordResetEmail } from 'firebase/auth'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { RiGoogleFill } from 'react-icons/ri'
import { LoadingSessionTemplate } from '../loading-session'

interface Props {
  referrer?: string
}

/** Handles the process of loading the auth state and requiring login, if the user is not signed in. */
export function SignInTemplate({ referrer = '/' }: Props) {
  const { authState, signInGoogle, signInEmail } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [hideResetPassword, setHideResetPassword] = useState(false)
  const [waiting, setWaiting] = useState(false)

  const {
    register,
    handleSubmit,
    setError: setFormError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const email = watch('email')

  const handleSignIn = useCallback(
    async (data: { email: string; password: string }) => {
      setWaiting(true)
      const error = await signInEmail(data.email, data.password)
      if (error === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS) {
        setError('Invalid credentials')
      }
      setWaiting(false)
    },
    [signInEmail]
  )

  const handleRecover = useCallback(async () => {
    if (!isValidEmail(email)) {
      setFormError('email', {})
      setError('Invalid email')
      return
    }

    setError(null)
    clearErrors()
    setHideResetPassword(true)
    setTimeout(() => setHideResetPassword(false), 5000)
    await sendPasswordResetEmail(auth, email)
  }, [email, setFormError])

  if (authState === AuthState.Loading || authState === AuthState.SignedIn) {
    return (
      <>
        {authState === AuthState.SignedIn && <Navigate to={referrer} />}
        <LoadingSessionTemplate />
      </>
    )
  }

  return (
    <div className="center h-full">
      <form
        className="acrylic p-[40px] flex flex-col gap-[10px] items-center w-full max-w-auto md:max-w-[400px]"
        onSubmit={handleSubmit(handleSignIn)}
      >
        <h1 className="!text-5xl font-serif !font-bold text-gold-4 uppercase">
          Sign-in
        </h1>
        <p className="text-center">
          Don&apos;t have an account yet?{' '}
          <Link
            to="/register"
            className="!text-blue-2 hover:!text-blue-1"
            search={(prev) => ({ referrer: prev.referrer })}
          >
            Create one
          </Link>
        </p>{' '}
        <input
          className={`${inputStyles.text_field} w-full ${errors.email ? inputStyles.error : ''}`}
          placeholder="Email"
          {...register('email', { required: true })}
          type="email"
          disabled={waiting}
        />
        <input
          className={`${inputStyles.text_field} w-full ${errors.password ? inputStyles.error : ''}`}
          placeholder="Password"
          {...register('password', { required: true })}
          type="password"
          disabled={waiting}
        />
        <div className="flex flex-col w-full items-center">
          <button
            type="submit"
            className={`${buttonStyles.primary} center w-full h-[40px] !text-lg`}
            disabled={waiting}
          >
            {waiting ? <Spinner className="size-6" /> : 'Sign-in'}
          </button>

          {error && <p className="text-red-500">{error}</p>}
        </div>
        {hideResetPassword ? (
          <p className="text-blue-2">Recovery email sent</p>
        ) : (
          <p
            className="text-blue-2 cursor-pointer hover:text-blue-1"
            onClick={handleRecover}
          >
            Forgot password?
          </p>
        )}
        <p>or</p>
        <button
          type="button"
          className={`${buttonStyles.primary} center gap-[10px] w-full h-[50px] !text-xl`}
          onClick={signInGoogle}
        >
          <RiGoogleFill size="24px" />
          Sign-in with Gogle
        </button>
      </form>
    </div>
  )
}
