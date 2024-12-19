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
  type ModalProps,
  Stack,
  Text,
} from '@chakra-ui/react'
import { type FormEvent, useCallback, useState } from 'react'

export default function SecretCodeModal(props: Omit<ModalProps, 'children'>) {
  const [input, setInput] = useState('')

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      runCommand(input)
      setInput('')
      props.onClose()
    },
    [input]
  )

  return (
    <Modal isCentered {...props}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader>Cheats</ModalHeader>
        <ModalBody>
          <Stack>
            <Text>Enter a cheat code to enable a secret funcionality.</Text>
            <Input
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
              }}
            />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSubmit}>Use</Button>
        </ModalFooter>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  )
}
