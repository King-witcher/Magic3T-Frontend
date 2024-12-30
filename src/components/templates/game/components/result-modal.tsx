import { useGame } from '@/contexts/game.context.tsx'
import { useRatingInfo } from '@/hooks/use-rating-info'
import {
  Center,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  type ModalProps,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useMemo } from 'react'

export function ResultModal(props: Omit<ModalProps, 'children'>) {
  const game = useGame()
  const { convertToLp } = useRatingInfo()

  const score = useMemo(() => {
    if (game.currentTeam === null) return 0
    if (!game.finalReport) return 0

    const score = 2 * game.finalReport?.[game.currentTeam].score - 1 // Converts into a range from -1 to 1
    return Math.round(score * 100) / 100
  }, [game.currentTeam, game.finalReport])

  return (
    <Modal isCentered {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody onClick={props.onClose} cursor="pointer">
          {game.currentTeam !== null && (
            <VStack spacing="10px">
              <Center fontSize="3rem">
                {game.finalReport?.winner === 1 - game.currentTeam && 'DEFEAT'}
                {game.finalReport?.winner === null && 'DRAW'}
                {game.finalReport?.winner === game.currentTeam && 'VICTORY'}
              </Center>
              <Flex gap="5px">
                <Text fontWeight={700}>Match Score:</Text>
                <Text>{score}</Text>
                <Text fontWeight={700} ml="10px">
                  LP Gain:
                </Text>
                <Text>
                  {convertToLp(game.finalReport?.[game.currentTeam].gain || 0)}{' '}
                  LP
                </Text>
              </Flex>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
