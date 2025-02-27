import { useGuardedAuth } from '@/contexts/guarded-auth.context'
import { Api } from '@/services/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChangeEvent, FormEvent, useState } from 'react'
import inputStyles from '@/styles/components/input.module.sass'
import buttonStyles from '@/styles/components/button.module.sass'

export function ChooseNicknameTemplate() {
  const [nickname, setNickname] = useState('')
  const { getToken, user } = useGuardedAuth()
  const [error, setError] = useState<string | null>(null)
  const client = useQueryClient()

  const changeNickMutation = useMutation({
    mutationKey: ['change-nickname', nickname],
    async mutationFn() {
      if (nickname.length < 3)
        throw new Error('nickname must contain at least 3 characters')

      const response = await Api.patch(
        '/users/me/nickname',
        {
          nickname,
        },
        {
          headers: {
            Authorization: await getToken(),
          },
        }
      )

      if (response.status === 400) {
        const message = response.data.message
        throw new Error(message)
      }

      if (response.status !== 200) {
        throw new Error(`unknown error from server: ${response.data.message}`)
      }
    },
    onMutate() {
      setError('')
    },
    onSuccess() {
      client.refetchQueries({
        queryKey: ['myself', user.id],
      })
    },
    onError(e) {
      setError(e.message.replace(/^(.)/, (match) => match.toUpperCase()) + '.')
    },
  })

  function handleChageNickname(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value

    if (value.length > 16) return

    if (
      !value.match(
        /^[a-zA-Z0-9áÁâÂãÃàÀäÄéÉêÊèÈëËíÍîÎìÌïÏóÓôÔõÕòÒöÖúÚûÛùÙüÜçÇñÑ\s]*$/
      )
    )
      return

    setNickname(value)
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    changeNickMutation.mutate()
  }

  return (
    <div className="center h-full">
      <form
        className="acrylic flex flex-col p-[30px] md:p-[40px] w-[600px]"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center !text-2xl font-serif !text-gold-4 uppercase">
          Choose your unique nickname
        </h1>
        <p className="text-sm text-grey-1 text-center !mt-[20px]">
          You will only be allowed to change your nickname again in{' '}
          <b>30 days</b>.
        </p>
        <input
          className={`${inputStyles.text_field} text-center !font-serif !h-[55px] !text-2xl !mt-[20px] tracking-wide`}
          placeholder="Nickname"
          value={nickname}
          onChange={handleChageNickname}
          onPaste={(e) => e.preventDefault()}
          disabled={changeNickMutation.isPending}
          spellCheck={false}
        />
        {error && (
          <p className="!mt-[10px] text-red-500 text-center">{error}</p>
        )}
        <button
          className={`${buttonStyles.primary} h-[50px] !mt-[20px] w-full md:w-[200px] self-center`}
          type="submit"
          disabled={changeNickMutation.isPending}
        >
          Save
        </button>
      </form>
    </div>
  )
}
