import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react'

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: ReactNode
  danger?: boolean
}

export function MenuOption({ children, danger, className, ...rest }: Props) {
  return (
    <div
      className={`p-[10px_15px] my-[5px] cursor-pointer flex gap-[10px] duration-150 items-center rounded-[8px] ${danger ? 'hover:bg-[#ff400040] hover:shadow-[0_0_2px_2px_#ff400040]' : 'hover:bg-[#ffffff20] hover:shadow-[0_0_2px_2px_#ffffff20]'} select-none font-serif tracking-wider ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
