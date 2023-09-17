import { Flex, Grid, Heading } from '@chakra-ui/react'

export default function Page() {
  return (
    <Flex
      w="100%"
      h="100%"
      flexDir="column"
      gap="20px"
      alignItems="center"
      justifyContent="center"
    >
      <Heading>Jogar</Heading>
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
            userSelect="none"
            _hover={{
              bg: 'pink.200',
            }}
            key={number}
          >
            Game Mode
          </Flex>
        ))}
      </Grid>
    </Flex>
  )
}
