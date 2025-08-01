import { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useConsole } from './console-provider'
import { ConsoleInput } from './console-input'

export function ConsoleTab() {
  const { lines, run, log } = useConsole()

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollableRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  function focusInput() {
    inputRef.current?.focus()
  }

  function handleSubmit(value: string) {
    log(`]${value}`)
    run(value)
  }

  useEffect(function listenOpen() {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code === 'Backquote' && event.ctrlKey)
        setIsOpen((value) => !value)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(
    function handleKeyDownWhenOpen() {
      if (!isOpen) return

      function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
          setIsOpen(false)
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    },
    [isOpen]
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(
    function keepScrollbarOnBottom() {
      if (scrollableRef.current) {
        scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight
      }
    },
    [lines]
  )

  return (
    <div
      data-open={isOpen}
      className={twMerge(
        'fixed w-dvw h-dvh left-0 top-0 z-10',
        'font-mono font-semibold text-[#ccc]',
        'transition-all duration-200 data-[open=false]:top-[-50dvh] data-[open=false]:pointer-events-none'
      )}
    >
      <div
        className="absolute top-0 w-full h-1/2 border-b-3 border-red-700 bg-[#000000c0] flex flex-col py-[1em] px-[1ch]"
        onClick={focusInput}
      >
        <div className="flex flex-1 relative">
          <div
            ref={scrollableRef}
            className="absolute inset-0 overflow-y-auto overflow-x-hidden"
          >
            <div className="flex flex-col justify-end min-h-full">
              {lines.map(
                (line, index) =>
                  line !== null && (
                    <pre
                      // biome-ignore lint/suspicious/noArrayIndexKey: does not change
                      key={index}
                      className="min-h-[1em] leading-4 break-all"
                    >
                      {line}
                    </pre>
                  )
              )}
            </div>
          </div>
        </div>

        <div className="w-full flex h-[1em] mt-[1em] items-center">
          <ConsoleInput focused={isOpen} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}
