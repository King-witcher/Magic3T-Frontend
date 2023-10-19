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

export default function SecretCodeModal(props: Omit<ModalProps, 'children'>) {
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
            <Input />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={props.onClose}>Entrar</Button>
        </ModalFooter>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  )
}
