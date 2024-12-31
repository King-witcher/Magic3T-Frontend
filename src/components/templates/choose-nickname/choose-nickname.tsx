import { useGuardedAuth } from '@/contexts/guarded-auth.context'
import { Api } from '@/services/api'
import { getAcrylicProps } from '@/utils/style-helpers'
import { Button, Center, Heading, Input, Text, VStack } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { ChangeEvent, useState } from 'react'

export function ChooseNicknameTemplate() {
  const [nickname, setNickname] = useState('')
  const { getToken } = useGuardedAuth()
  const [error, setError] = useState<string | null>(null)

  const changeNickMutation = useMutation({
    mutationKey: ['change-nickname', nickname],
    mutationFn: async () => {
      if (nickname.length < 3)
        throw new Error('nickname must contain at least 3 characters')

      setError('')

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
    onError: (e) => {
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

  return (
    <Center h="full">
      <VStack
        spacing={0}
        {...getAcrylicProps()}
        boxShadow="0 0 80px 0 #00000040"
        maxW="full"
        w="600px"
        p={{ base: '30px', sm: '40px' }}
      >
        <Heading textAlign="center">Choose your unique nickname</Heading>
        <Text
          fontSize="0.875rem"
          color="#ffffffc0"
          textAlign="center"
          mt="20px"
        >
          You will only be allowed to change your nickname again in{' '}
          <b>30 days</b>.
        </Text>
        <Input
          mt="20px"
          variant="form"
          h="55px"
          textAlign="center"
          fontSize="24px"
          value={nickname}
          onChange={handleChageNickname}
          fontWeight={300}
          onPaste={(e) => e.preventDefault()}
          isDisabled={changeNickMutation.isPending}
          spellCheck={false}
        />
        {error && (
          <Text color="#ff4040" mt="10px" textAlign="center">
            {error}
          </Text>
        )}
        <Button
          {...getAcrylicProps()}
          h="50px"
          mt="20px"
          boxShadow="none"
          color="light"
          type="submit"
          w={{ base: 'full', md: '200px' }}
          onClick={() => changeNickMutation.mutate()}
          isDisabled={changeNickMutation.isPending}
        >
          Save
        </Button>
        v
      </VStack>
    </Center>
  )
}
