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
  type ModalProps,
} from '@chakra-ui/react'

export function ForfeitModal(props: Omit<ModalProps, 'children'>) {
  const { forfeit } = useGame()

  return (
    <Modal isCentered {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Surrender</ModalHeader>
        <ModalBody>Are you sure you want to surrender?</ModalBody>
        <ModalFooter>
          <Button
            onClick={props.onClose}
            color="light"
            bg="#ffffff40"
            border="1px solid #ffffff40"
            _hover={{
              bg: '#ffffff80',
            }}
          >
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={async () => {
              forfeit()
              props.onClose()
            }}
            color="#ff4040"
            bg="#ff404040"
            border="1px solid #ff404040"
            _hover={{
              bg: '#ff404080',
            }}
          >
            Surrender
          </Button>
        </ModalFooter>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  )
}
