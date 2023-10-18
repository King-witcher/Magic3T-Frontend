import { Flex, VStack, Text } from '@chakra-ui/layout'
import { TimeCounter } from './TimeCounter'
import ChoiceCollection from './ChoiceCollection'
import { useGame } from '@/contexts/GameContext'
import {
  Input,
  InputGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  useDisclosure,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ForfeitModal from './ForfeitModal'
import { GameStatus } from '@/types/types'

interface Props {
  player: 'current' | 'opponent'
}

export default function PlayerDeck({ player }: Props) {
  const { user } = useAuth()

  const easterEgg = user?.displayName?.includes('Bianca Vieira')
    ? 'não é burmor, é morbur c:'
    : user?.displayName?.includes('Marileia Almeida')
    ? 'Te amo, mãe <3'
    : 'Sem easter eggs por ora.'

  const [message, setMessage] = useState('')
  const {
    isOpen: forfeitModaOpen,
    onClose: closeForfeitModal,
    onOpen: openForfeitModal,
  } = useDisclosure()

  const {
    playerChoices,
    oponentChoices,
    playerTimer,
    oponentTimer,
    triple,
    oponentProfile,
    gameStatus,
    sendMessage,
  } = useGame()
  const popoverFocusElement = useRef(null)

  const currentPlayer = player === 'current'
  const choices = currentPlayer ? playerChoices : oponentChoices
  const timer = currentPlayer ? playerTimer : oponentTimer

  const {
    isOpen: chatIsOpen,
    onClose: chatOnClose,
    onOpen: chatOnOpen,
  } = useDisclosure()

  function handleSubmitMessage(e: any) {
    e.preventDefault()
    sendMessage(message)
    setMessage('')
    //onClose()
  }

  function handleChangeMessage(e: any) {
    setMessage(e.target.value)
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
            isOpen={chatIsOpen}
            onClose={chatOnClose}
            // onOpen={chatOnOpen}
          >
            <Menu>
              <PopoverAnchor>
                <MenuButton
                  disabled={!currentPlayer}
                  cursor={currentPlayer ? 'pointer' : 'auto'}
                >
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
                  >
                    <TimeCounter timer={timer} />
                  </Flex>
                </MenuButton>
              </PopoverAnchor>
              <MenuList hidden={!currentPlayer}>
                <MenuItem onClick={chatOnOpen}>Enviar mensagem</MenuItem>
                <MenuItem
                  hidden={gameStatus !== GameStatus.Playing}
                  bg="red.200"
                  _hover={{
                    bg: 'red.400',
                  }}
                  onClick={openForfeitModal}
                >
                  Render-se
                  <ForfeitModal
                    onClose={closeForfeitModal}
                    isOpen={forfeitModaOpen}
                  />
                </MenuItem>
              </MenuList>
            </Menu>
            <PopoverContent w={['100%', '500px']}>
              <PopoverArrow />
              <PopoverHeader>Enviar mensagem</PopoverHeader>
              <PopoverBody>
                <form onSubmit={handleSubmitMessage}>
                  <Input
                    variant="unstyled"
                    ref={popoverFocusElement}
                    value={message}
                    onChange={handleChangeMessage}
                    placeholder={easterEgg}
                    maxLength={100}
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
