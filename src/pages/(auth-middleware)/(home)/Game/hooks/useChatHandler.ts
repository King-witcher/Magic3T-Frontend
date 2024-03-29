import { useGame } from '@/contexts/GameContext.tsx'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useChatHandler() {
  const { messages, sendMessage } = useGame()
  const [currentMessage, setCurrentMessage] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  function handleSubmitMessage(e: any) {
    e.preventDefault()
    sendMessage(currentMessage)
    setCurrentMessage('')
  }

  function handleChangeMessageField(e: any) {
    setCurrentMessage(e.target.value)
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

  return {
    messages,
    currentMessage,
    handleSubmitMessage,
    handleChangeMessageField,
    scrollRef,
  }
}
