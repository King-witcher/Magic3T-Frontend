import { useGame } from '@/contexts/GameContext'
import { useBreakpoint, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export function useMessageToast(enabled: boolean) {
  const { gameState, oponentProfile } = useGame()
  const breakpoint = useBreakpoint()
  const toast = useToast()

  useEffect(() => {
    if (!gameState?.messages.length) return
    if (breakpoint !== 'base') return
    if (!enabled) return

    const { sender, content } =
      gameState.messages[gameState.messages.length - 1]

    if (sender === 'you') return

    toast({
      title: `${oponentProfile?.nickname} diz:`,
      description: content,
      status: 'info',
      duration: 2000,

      isClosable: true,
      containerStyle: {
        maxW: '100%',
        p: '20px',
      },
    })
  }, [gameState?.messages.length])
}
