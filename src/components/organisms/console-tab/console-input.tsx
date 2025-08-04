import { useKeyListener } from '@/hooks/use-key-listener'
import { useEffect, useState } from 'react'

interface Props {
  onSubmit: (value: string) => void
  focused: boolean
}

const printableChars = new Set([
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',

  '~',
  '!',
  '@',
  '#',
  '$',
  '^',
  '&',
  '*',
  '(',
  ')',
  '-',
  '_',
  '=',
  '+',

  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',

  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',

  '[',
  ']',
  '{',
  '}',
  '\\',
  '|',

  ';',
  ':',
  '"',
  "'",

  ',',
  '<',
  '.',
  '>',
  '/',
  '?',

  ' ',
])

export function ConsoleInput({ onSubmit, focused }: Props) {
  const [value, setValue] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const spacesBeforeCursor = ' '.repeat(cursorPosition + 1)

  useKeyListener(
    'Enter',
    (event) => {
      event.preventDefault()
      if (value.trim()) {
        onSubmit(value)
        setValue('')
        setCursorPosition(0)
      }
    },
    [value, onSubmit],
    focused
  )

  useKeyListener(
    'Backspace',
    () => {
      if (cursorPosition > 0) {
        setValue(
          (prev) =>
            prev.slice(0, cursorPosition - 1) + prev.slice(cursorPosition)
        )
        setCursorPosition(cursorPosition - 1)
      }
    },
    [cursorPosition],
    focused
  )

  useKeyListener(
    'Delete',
    () => {
      if (cursorPosition < value.length) {
        setValue(
          (prev) =>
            prev.slice(0, cursorPosition) + prev.slice(cursorPosition + 1)
        )
      }
    },
    [value, cursorPosition],
    focused
  )

  useKeyListener(
    'ArrowLeft',
    () => {
      setCursorPosition((prev) => Math.max(0, prev - 1))
    },
    [],
    focused
  )

  useKeyListener(
    'ArrowRight',
    () => {
      setCursorPosition((prev) => Math.min(value.length, prev + 1))
    },
    [value],
    focused
  )

  useEffect(() => {
    if (!focused) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (printableChars.has(event.key)) {
        setValue(
          (prev) =>
            prev.slice(0, cursorPosition) +
            event.key +
            prev.slice(cursorPosition)
        )
        setCursorPosition((prev) => prev + 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [cursorPosition, focused])

  return (
    <pre className="relative">
      ]{value}
      <pre className="absolute inset-0 animate-blink pointer-events-none">
        {spacesBeforeCursor}_
      </pre>
    </pre>
  )
}
