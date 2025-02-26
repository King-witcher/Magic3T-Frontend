import { AuthState, useAuth } from '@/contexts/auth.context.tsx'
import { Link, Navigate } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { RiGoogleFill } from 'react-icons/ri'
import { LoadingSessionTemplate } from '../loading-session'
import inputStyles from '@/styles/components/input.module.sass'
import buttonStyles from '@/styles/components/button.module.sass'
import { Spinner } from '@/components/atoms'

interface FormData {
  email: string
  password: string
  checkPassword: string
}

interface Props {
  referrer?: string
}

export function RegisterTemplate({ referrer = '/' }: Props) {
  const { authState, signInGoogle, registerEmail } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [waiting, setWaiting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const errorMap: Record<string, string> = {
    'auth/email-already-in-use': 'Já existe uma conta com o este email.',
    'auth/invalid-email': 'Email inválido',
    'auth/weak-password': 'Senha muito fraca',
  }

  const handleRegister = useCallback(
    async ({ email, password, checkPassword }: FormData) => {
      if (password !== checkPassword) {
        setError('Password does not match')
        return
      }

      setWaiting(true)
      setError(null)
      const error = await registerEmail(email, password)
      if (error) {
        setError(errorMap[error] || 'Unknown error')
      }
      setWaiting(false)
    },
    []
  )
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
        onSubmit={handleSubmit(handleRegister)}
      >
        <h1 className="!text-5xl font-serif !font-bold !text-gold-4 uppercase">
          Register
        </h1>
        <Link
          className="!text-blue-2 hover:!text-blue-1"
          to="/sign-in"
          search={(prev) => ({ referrer: prev.referrer })}
        >
          Already have an account?
        </Link>
        <input
          className={`${inputStyles.text_field} w-full ${errors.email ? inputStyles.error : ''}`}
          placeholder="Email"
          disabled={waiting}
          type="email"
          {...register('email', { required: true })}
        />
        <input
          className={`${inputStyles.text_field} w-full ${errors.password ? inputStyles.error : ''}`}
          placeholder="Password"
          disabled={waiting}
          type="password"
          {...register('password', { required: true })}
          {...(errors.password
            ? {
                borderColor: '#ff4040',
                boxShadow: 'inset 0 0 5px 0 #ff4040',
              }
            : {})}
        />
        <input
          className={`${inputStyles.text_field} w-full ${errors.checkPassword ? inputStyles.error : ''}`}
          placeholder="Check password"
          disabled={waiting}
          {...register('checkPassword', { required: true })}
          type="password"
        />
        <div className="flex flex-col w-full items-center">
          <button
            className={`${buttonStyles.primary} center w-full h-[50px] !text-xl`}
            type="submit"
            disabled={waiting}
            onClick={handleSubmit(handleRegister)}
          >
            {waiting ? <Spinner className="size-6" /> : 'Register'}
          </button>
          {error && (
            <p className="text-red-500" color="#ff4000">
              {error}
            </p>
          )}
        </div>

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
