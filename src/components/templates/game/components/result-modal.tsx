import { useGame } from '@/contexts/game.context.tsx'
import { GameStatus } from '@/types/game'
import {
  Center,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  type ModalProps,
} from '@chakra-ui/react'

export function ResultModal(props: Omit<ModalProps, 'children'>) {
  const { gameStatus } = useGame()

  return (
    <Modal isCentered {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody onClick={props.onClose} cursor="pointer">
          <Center fontSize="3rem">
            {gameStatus === GameStatus.Defeat && 'DEFEAT'}
            {gameStatus === GameStatus.Draw && 'DRAW'}
            {gameStatus === GameStatus.Victory && 'VICTORY'}
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
