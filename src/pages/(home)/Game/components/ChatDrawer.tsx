import { useGame } from '@/contexts/GameContext'
import { formatMinutes } from '@/utils/timeFormat'
import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerProps,
  Input,
  Stack,
  VStack,
  Text,
  DrawerCloseButton,
} from '@chakra-ui/react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface Props extends Omit<DrawerProps, 'children'> {}

export default function ChatDrawer(props: Props) {
  const { messages, sendMessage } = useGame()
  const [message, setMessage] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  function handleSubmitMessage(e: any) {
    e.preventDefault()
    sendMessage(message)
    setMessage('')
  }

  function handleChangeMessage(e: any) {
    setMessage(e.target.value)
  }

  const smoothScroll = useCallback(() => {
    let last = Date.now()
    function movedn() {
      if (!scrollRef.current) return
      const current = Date.now()
      const deltaTime = current - last
      last = current
      const position = scrollRef.current.scrollTop
      const target =
        scrollRef.current.scrollHeight - scrollRef.current.clientHeight
      const distance = target - position
      const movement = deltaTime * (distance * 0.005 + 0.3)
      scrollRef.current.scrollTop = Math.min(target, position + movement)
      if (position + movement >= target) return
      window.requestAnimationFrame(movedn)
    }

    movedn()
  }, [])

  useEffect(smoothScroll, [messages])

  return (
    <Drawer {...props}>
      <DrawerCloseButton />
      <DrawerOverlay backdropFilter="blur(10px)" />
      <DrawerContent
        rounded="10px 0 0 10px"
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        <Box flex="1" pos="relative">
          <Box
            w="full"
            h="full"
            pos="absolute"
            overflowY="auto"
            flexDir="column"
            ref={scrollRef}
          >
            <VStack
              justifyContent="flex-start"
              p="20px 20px"
              gap="12px"
              minH="full"
              sx={{
                '& > :first-child': {
                  marginTop: 'auto',
                },
              }}
            >
              {messages.map((message) => (
                <Stack
                  maxW="90%"
                  p="8px 13px"
                  gap="3px"
                  rounded="8px"
                  color={message.sender === 'you' ? 'blue.700' : 'red.700'}
                  bg={message.sender === 'you' ? 'blue.100' : 'red.100'}
                  key={message.timestamp}
                  alignSelf={
                    message.sender === 'you' ? 'flex-end' : 'flex-start'
                  }
                >
                  <Text fontSize="18px" lineHeight="20px">
                    {message.content}
                  </Text>
                  <Text
                    fontSize="12px"
                    lineHeight="14px"
                    fontWeight={600}
                    opacity={0.8}
                    alignSelf="flex-end"
                  >
                    {formatMinutes(message.timestamp)}
                  </Text>
                </Stack>
              ))}
            </VStack>
          </Box>
        </Box>
        <Box as="form" onSubmit={handleSubmitMessage} w="full">
          <Input
            variant="unstyled"
            boxShadow="none"
            borderTop="solid 1px #ddd"
            p="14px 20px"
            fontSize="18px"
            rounded="0"
            value={message}
            onChange={handleChangeMessage}
            placeholder={'Escreva uma mensagem'}
            maxLength={1024}
          />
        </Box>
      </DrawerContent>
    </Drawer>
  )
}
