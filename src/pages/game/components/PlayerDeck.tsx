import { Flex, VStack, Text } from '@chakra-ui/layout'
import { TimeCounter } from './TimeCounter'
import ChoiceCollection from './ChoiceCollection'
import { useGame } from '@/contexts/GameContext'
import {
  Input,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface Props {
  player: 'current' | 'opponent'
}

export default function PlayerDeck({ player }: Props) {
  const [message, setMessage] = useState('')
  const { isOpen, onClose, onOpen, onToggle } = useDisclosure()
  const { user } = useAuth()

  const {
    playerChoices,
    oponentChoices,
    playerTimer,
    oponentTimer,
    triple,
    oponentProfile,
    sendMessage,
  } = useGame()
  const popoverFocusElement = useRef(null)

  const currentPlayer = player === 'current'
  const choices = currentPlayer ? playerChoices : oponentChoices
  const timer = currentPlayer ? playerTimer : oponentTimer

  function handleSubmitMessage(e: any) {
    e.preventDefault()
    sendMessage(message)
    setMessage('')
    //onClose()
  }

  function handleChangeMessage(e: any) {
    setMessage(e.target.value)
  }

  function handleOpen() {
    console.log(1)
    onOpen()
  }

  return (
    <Flex
      flex="1"
      w="100%"
      justifyContent={currentPlayer ? 'flex-start' : 'flex-end'}
      alignItems={currentPlayer ? 'flex-end' : 'flex-start'}
    >
      <Flex
        alignItems="center"
        h="fit-content"
        gap="30px"
        margin="10px"
        flexDir={currentPlayer ? 'row' : 'row-reverse'}
      >
        <VStack>
          <Popover
            initialFocusRef={popoverFocusElement}
            variant="messageBox"
            //returnFocusOnClose={false}
            isOpen={isOpen}
            onClose={onClose}
            onOpen={handleOpen}
          >
            <PopoverAnchor>
              <Flex
                rounded="100%"
                bg={currentPlayer ? 'green.500' : 'red.600'}
                w="70px"
                h="70px"
                alignItems="center"
                justifyContent="center"
                fontWeight="bold"
                color="white"
                userSelect="none"
                cursor={currentPlayer ? 'pointer' : 'auto'}
                _hover={
                  currentPlayer
                    ? {
                        bg: 'green.400',
                      }
                    : undefined
                }
                onMouseDown={currentPlayer ? onToggle : undefined}
              >
                <TimeCounter timer={timer} />
              </Flex>
            </PopoverAnchor>
            <PopoverContent w={['auto', '500px']}>
              <PopoverArrow />
              <PopoverHeader>Enviar mensagem</PopoverHeader>
              <PopoverBody>
                <form onSubmit={handleSubmitMessage}>
                  <Input
                    ref={popoverFocusElement}
                    value={message}
                    onChange={handleChangeMessage}
                    maxLength={64}
                  />
                </form>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <Text fontWeight="bold">
            {currentPlayer
              ? user?.displayName || 'Você'
              : oponentProfile?.name || 'Anônimo'}
          </Text>
        </VStack>
        <ChoiceCollection
          choices={choices}
          triple={triple}
          flexDir={currentPlayer ? 'row' : 'row-reverse'}
        />
      </Flex>
    </Flex>
  )
}
