import { useAuth } from '@/contexts/AuthContext'
import { useGame } from '@/contexts/GameContext'
import { formatMinutes } from '@/utils/timeFormat'
import {
  Box,
  Center,
  Input,
  Stack,
  StackProps,
  VStack,
  Text,
} from '@chakra-ui/react'
import { RefObject, useCallback, useEffect, useRef, useState } from 'react'

interface Props extends StackProps {
  inputRef: RefObject<HTMLInputElement>
}

export default function ChatBox({ inputRef, ...props }: Props) {
  const { messages, sendMessage } = useGame()
  const [message, setMessage] = useState('')
  const { user } = useAuth()
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
    <Center flexShrink={0} h="full" position="relative" w="500px" {...props}>
      <VStack
        border="solid 1px #ddd"
        borderRadius="10px"
        w="500px"
        h="full"
        gap="0"
        pos="absolute"
        overflow="hidden"
      >
        <Box w="full" h="full" flex="1" overflowY="auto" ref={scrollRef}>
          <VStack
            justifyContent="flex-end"
            w="full"
            gap="8px"
            minH="full"
            p="25px 20px"
          >
            {messages.map((message) => (
              <Stack
                maxW="300px"
                p="8px 13px"
                gap="3px"
                rounded="8px"
                color={message.sender === 'you' ? 'blue.700' : 'red.700'}
                bg={message.sender === 'you' ? 'blue.100' : 'red.100'}
                key={message.timestamp}
                alignSelf={message.sender === 'you' ? 'flex-end' : 'flex-start'}
              >
                <Text fontSize="16px" lineHeight="18px">
                  {message.content}
                </Text>
                <Text
                  fontSize="10px"
                  lineHeight="12px"
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
        <Box as="form" onSubmit={handleSubmitMessage} w="full">
          <Input
            ref={inputRef}
            variant="unstyled"
            boxShadow="none"
            borderTop="solid 1px #ddd"
            rounded="0"
            value={message}
            onChange={handleChangeMessage}
            placeholder={'Escreva uma mensagem'}
            maxLength={1024}
          />
        </Box>
      </VStack>
    </Center>
  )
}
