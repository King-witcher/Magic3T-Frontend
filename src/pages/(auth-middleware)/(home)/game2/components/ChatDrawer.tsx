import { useChatHandler } from '@/pages/(auth-middleware)/(home)/game2/hooks/useChatHandler'
import { formatMinutes } from '@/utils/timeFormat'
import {
  Box,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  type DrawerProps,
  Input,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'

interface Props extends Omit<DrawerProps, 'children'> {}

export default function ChatDrawer(props: Props) {
  const {
    messages,
    scrollRef,
    handleSubmitMessage,
    handleChangeMessageField,
    currentMessage,
  } = useChatHandler()

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
            value={currentMessage}
            onChange={handleChangeMessageField}
            placeholder="Escreva uma mensagem"
            maxLength={1024}
          />
        </Box>
      </DrawerContent>
    </Drawer>
  )
}
