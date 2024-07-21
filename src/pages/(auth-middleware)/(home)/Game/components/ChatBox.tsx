import { useChatHandler } from '@/pages/(auth-middleware)/(home)/game/hooks/useChatHandler'
import { formatMinutes } from '@/utils/timeFormat'
import {
  Box,
  Center,
  Input,
  Stack,
  type StackProps,
  Text,
  VStack,
} from '@chakra-ui/react'
import type { RefObject } from 'react'

interface Props extends StackProps {
  inputRef: RefObject<HTMLInputElement>
}

export default function ChatBox({ inputRef, ...props }: Props) {
  const {
    messages,
    scrollRef,
    handleSubmitMessage,
    handleChangeMessageField,
    currentMessage,
  } = useChatHandler()

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
            value={currentMessage}
            onChange={handleChangeMessageField}
            placeholder="Escreva uma mensagem"
            maxLength={1024}
          />
        </Box>
      </VStack>
    </Center>
  )
}
