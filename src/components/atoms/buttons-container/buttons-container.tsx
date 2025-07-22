import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  disabled: boolean
  className?: string
}

export function ButtonsContainer({ children, className, disabled }: Props) {
  return (
    <div
      className={`acrylic !bg-transparent flex flex-col xs:flex-row !rounded-[16px] border-none overflow-hidden w-full ${className} ${disabled ? 'opacity-50' : ''}`}
    >
      {children}
    </div>
  )
}
