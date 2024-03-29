import { Choice } from '@/types/game.ts'
import { Center } from '@chakra-ui/react'

interface Props {
  number: Choice
  side: 'reference' | 'oponent' | 'none'
  highlight?: boolean
}

export default function Numberbox({ number, side }: Props) {
  return (
    <Center
      px={['6px', '8px 10px']}
      borderRadius={['8px']}
      minW={['40px', '50px']}
      h={['40px', '50px']}
      fontSize={['16px', '20px']}
      bg={
        side === 'reference'
          ? 'blue.300'
          : side === 'oponent'
          ? 'red.300'
          : 'gray.300'
      }
    >
      {number}
    </Center>
  )
}
