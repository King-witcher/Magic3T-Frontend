import Console1 from '@/assets/textures/console1.png'
import Console2 from '@/assets/textures/console2.jpg'
import { Console, ConStyle, SystemCvars } from '@/lib/console'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { twMerge } from 'tailwind-merge'
import { ConsoleInput } from './console-input'
import styles from './styles.module.css'

function subscribeToConsoleChanges(callback: () => void): () => void {
  return Console.on('changeBuffer', callback)
}

const consoleStyles = new Set<number>([ConStyle.Default, ConStyle.Q3])

export function ConsoleTab() {
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollableRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  const lines = useSyncExternalStore(
    subscribeToConsoleChanges,
    () => Console.lines
  )

  let con_style = Console.useCvar(SystemCvars.ConStyle) as number
  if (!consoleStyles.has(con_style)) con_style = ConStyle.Default

  function focusInput() {
    inputRef.current?.focus()
  }

  function handleSubmit(value: string) {
    Console.log(`]${value}`)
    Console.exec(value)
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
        'font-mono text-sm font-semibold text-gold-2',
        'transition-all duration-200 data-[open=false]:top-[-50dvh] data-[open=false]:pointer-events-none',
        con_style === ConStyle.Q3 && 'text-white'
      )}
    >
      <div
        className={twMerge(
          'absolute top-0 w-full h-1/2 border-gold-4 bg-[#000000c0] border-b-3 flex flex-col py-[1em] px-[1ch]',
          con_style === ConStyle.Q3 && 'border-[red]'
        )}
        onClick={focusInput}
      >
        {con_style === ConStyle.Q3 && (
          <>
            <div
              className={styles.console1}
              style={{
                backgroundImage: `url(${Console2})`,
              }}
            />
            <div
              className={styles.console2}
              style={{
                backgroundImage: `url(${Console1})`,
              }}
            />
          </>
        )}

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
                      className="min-h-[1em] overflow-hidden break-all whitespace-pre-wrap"
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
