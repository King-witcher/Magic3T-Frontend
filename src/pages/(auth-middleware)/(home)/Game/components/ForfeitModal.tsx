import { useGame } from '@/contexts/game.context.tsx'
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

export default function ForfeitModal(props: Omit<ModalProps, 'children'>) {
  const { forfeit } = useGame()

  return (
    <Modal isCentered {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Deseja render-se?</ModalHeader>
        <ModalBody>Você perderá a partida. Confirme sua ação.</ModalBody>
        <ModalFooter>
          <Button onClick={props.onClose}>Cancelar</Button>
          <Button
            colorScheme="red"
            onClick={async () => {
              forfeit()
              props.onClose()
            }}
          >
            Render-se
          </Button>
        </ModalFooter>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  )
}
