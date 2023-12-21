import { runCommand } from '@/lib/Commands'
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'

export default function SecretCodeModal(props: Omit<ModalProps, 'children'>) {
  const [input, setInput] = useState('')

  function useCheat() {
    runCommand(input)
    props.onClose()
  }

  return (
    <Modal isCentered {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Códigos secretos</ModalHeader>
        <ModalBody>
          <Stack>
            <Text>
              Insira um código para ativar alguma funcionalidade secreta ou
              cheat do jogo.
            </Text>
            <Input
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
              }}
            />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={useCheat}>Usar</Button>
        </ModalFooter>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  )
}
