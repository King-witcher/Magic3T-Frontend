import {
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

type FormData = {
  username: string
  password: string
}

export function Login() {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      username: '',
      password: '',
    },
  })

  function onSubmit({ username, password }: FormData) {
    alert(username)
  }

  return (
    <Center w="100%" h="100%">
      <VStack w="400px" as="form" gap="10px" onSubmit={handleSubmit(onSubmit)}>
        <Heading mb="20px">Entrar</Heading>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input rounded="10px" {...register('username')} />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input rounded="10px" type="password" {...register('password')} />
        </FormControl>
        <Flex justifyContent="flex-end" w="100%" gap="10px">
          <Button rounded="10px">Criar conta</Button>
          <Button rounded="10px" colorScheme="pink" type="submit">
            Entrar
          </Button>
        </Flex>
      </VStack>
    </Center>
  )
}
