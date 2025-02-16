import { formatMinutes } from '@/utils/timeFormat'
import type { RefObject } from 'react'
import { useChatHandler } from '../hooks/useChatHandler'

interface Props {
  inputRef: RefObject<HTMLInputElement | null>
  className?: string
}

export function ChatBox({ inputRef, className }: Props) {
  const {
    messages,
    scrollRef,
    handleSubmitMessage,
    handleChangeMessageField,
    currentMessage,
  } = useChatHandler()

  return (
    <div
      className={`center relative lg:w-[400px] pointer-events-none select-none opacity-50 ${className}`}
    >
      <div className="acrylic flex flex-col inset-0 absolute overflow-hidden">
        <div className="w-full h-full flex-[1] overflow-auto" ref={scrollRef}>
          <div className="flex flex-col justify-end w-full gap-[8px] min-h-full p-[25px_20px]">
            {messages.map((message) => (
              <div
                key={message.time}
                className={`max-w-[300px] p-[8px_13px] gap-[3px] text-gold-1 ${message.sender === 'you' ? 'self-end' : 'self-start'} rounded-[6px]`}
              >
                <p className="leading-5">{message.message}</p>
                <span className="text-[0.625rem] leading-3 font-bold opacity-80 self-end">
                  {formatMinutes(message.time)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <form className="w-full" onSubmit={handleSubmitMessage}>
          <input
            ref={inputRef}
            className="!border-t-grey-1 !border-t-1 w-full text-gold-1 placeholder:text-grey-1 !p-[10px_15px]"
            value={currentMessage}
            onChange={handleChangeMessageField}
            placeholder="Write a message"
            maxLength={1024}
          />
        </form>
      </div>
    </div>
  )
}
