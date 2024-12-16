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
import { useChatHandler } from '../hooks/useChatHandler'

interface Props extends StackProps {
  inputRef: RefObject<HTMLInputElement>
}

export function ChatBox({ inputRef, ...props }: Props) {
  const {
    messages,
    scrollRef,
    handleSubmitMessage,
    handleChangeMessageField,
    currentMessage,
  } = useChatHandler()

  return (
    <Center flexShrink={0} position="relative" w="400px" {...props}>
      <VStack
        border="solid 1px #ffffff40"
        bg="#ffffff30"
        boxShadow="0 0 10px 0 #00000040"
        borderRadius="10px"
        inset={0}
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
                rounded="6px"
                color="light"
                bg="#ffffff30"
                border="solid 1px #ffffff40"
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
            borderTop="solid 1px #ffffff40"
            color="light"
            rounded="0"
            value={currentMessage}
            onChange={handleChangeMessageField}
            placeholder="Write a message"
            _placeholder={{
              color: '#ffffff80',
            }}
            maxLength={1024}
          />
        </Box>
      </VStack>
    </Center>
  )
}
