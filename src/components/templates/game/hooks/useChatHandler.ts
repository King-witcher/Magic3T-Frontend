import { useGame } from '@/contexts/game.context.tsx'
import { MessageData } from '@/types/game-socket'
import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

export function useChatHandler() {
  const gameCtx = useGame()
  const [currentMessage, setCurrentMessage] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  function handleSubmitMessage(e: FormEvent) {
    e.preventDefault()
    gameCtx.sendMessage(currentMessage)
    setCurrentMessage('')
  }

  function handleChangeMessageField(e: ChangeEvent<HTMLInputElement>) {
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

  useEffect(smoothScroll, [])

  return {
    messages: [] as MessageData[],
    currentMessage,
    handleSubmitMessage,
    handleChangeMessageField,
    scrollRef,
  }
}
