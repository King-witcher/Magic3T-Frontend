import { Tooltip as RadixTooltip } from 'radix-ui'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
  children: ReactNode
  label: string
}

export function Tooltip({ children, label }: Props) {
  return <RadixTooltip.Provider delayDuration={100}>
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>
        {children}
      </RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          className={twMerge(
            'bg-[#ffffff40] backdrop-blur-md border-1 border-[#A09B8C] px-2 py-1 rounded-md',
            'text-sans text-xs text-gold-1 tracking-wide',
            'data-[state=delayed-open]:animate-fade-in data-[state=closed]:bg-red-500',
          )}
        >
          {label}
          <RadixTooltip.Arrow className='fill-[#A09B8C]' />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  </RadixTooltip.Provider>
}
