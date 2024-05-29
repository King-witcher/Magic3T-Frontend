import { useAuth } from '@/contexts/auth.context.tsx'
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/react'

export default function LogoutModal(props: Omit<ModalProps, 'children'>) {
  const { signOut } = useAuth()

  return (
    <Modal isCentered {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sair agora?</ModalHeader>
        <ModalBody>Deseja mesmo encerrar a sua sessão em Magic3T?</ModalBody>
        <ModalFooter>
          <Button onClick={props.onClose}>Cancelar</Button>
          <Button
            colorScheme="red"
            onClick={async () => {
              signOut()
              props.onClose()
            }}
          >
            Sair
          </Button>
        </ModalFooter>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  )
}
