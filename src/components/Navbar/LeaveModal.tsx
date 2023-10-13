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
import { useNavigate } from 'react-router-dom'

export default function LeaveModal({
  isOpen,
  onClose,
}: Omit<ModalProps, 'children'>) {
  const navigate = useNavigate()

  function handleModalOkclick() {
    navigate('/')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Abandonar partida?</ModalHeader>
        <ModalBody>
          Sair da tela de partida será considerado como rendição e você perderá
          a partida atual.
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cancelar</Button>
          <Button colorScheme="red" onClick={handleModalOkclick}>
            Render
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
