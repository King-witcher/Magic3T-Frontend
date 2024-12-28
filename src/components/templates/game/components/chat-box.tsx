import { getAcrylicProps } from '@/utils/style-helpers'
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
    <Center flexShrink={0} position="relative" w={{ sm: '400px' }} {...props}>
      <VStack
        {...getAcrylicProps()}
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
                color="light"
                key={message.time}
                alignSelf={message.sender === 'you' ? 'flex-end' : 'flex-start'}
                {...getAcrylicProps()}
                boxShadow="none"
                rounded="6px"
              >
                <Text fontSize="16px" lineHeight="18px">
                  {message.message}
                </Text>
                <Text
                  fontSize="10px"
                  lineHeight="12px"
                  fontWeight={600}
                  opacity={0.8}
                  alignSelf="flex-end"
                >
                  {formatMinutes(message.time)}
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
            borderTop="solid 1px #ffffff60"
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
