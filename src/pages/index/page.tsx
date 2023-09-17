import { GameMode, useQueue } from '@/contexts/QueueContext'
import { Timer } from '@/lib/Timer'
import { Flex, Grid, Heading, Spinner } from '@chakra-ui/react'

export default function Page() {
  const { enqueue, dequeue, queueMode } = useQueue()

  function handleEnqueue() {
    enqueue(GameMode.Casual, () => {})
  }

  return (
    <Flex
      w="100%"
      h="100%"
      flexDir="column"
      gap="20px"
      alignItems="center"
      justifyContent="center"
    >
      <Heading>Jogar {timer.getRemaining()}</Heading>
      <Grid
        gridTemplateColumns={'200px 200px'}
        gridTemplateRows="200px 200px"
        gap="10px"
      >
        {[1, 2, 3, 4].map((number) => (
          <Flex
            alignItems="center"
            justifyContent="center"
            bg="gray.100"
            rounded="10px"
            cursor="pointer"
            fontSize="20px"
            userSelect="none"
            _hover={{
              bg: 'pink.200',
            }}
            key={number}
            onClick={queueMode ? dequeue : handleEnqueue}
          >
            <Flex flexDir="column" alignItems="center" gap="10px">
              Quick Match
              {queueMode && <Spinner />}
            </Flex>
          </Flex>
        ))}
      </Grid>
    </Flex>
  )
}
