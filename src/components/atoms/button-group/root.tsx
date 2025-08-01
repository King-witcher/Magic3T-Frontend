import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
  children: ReactNode
  className?: string
}

export function Root(props: Props) {
  const { children, className } = props

  return (
    <div
      className={twMerge(
        'flex flex-col lg:flex-row rounded-xl overflow-hidden border-1 border-[#A09B8C]',
        className
      )}
    >
      {children}
    </div>
  )
}
