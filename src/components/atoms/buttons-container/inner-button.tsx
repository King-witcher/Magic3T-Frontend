import { ComponentProps, ReactNode } from 'react'

interface Props extends ComponentProps<'div'> {
  children: ReactNode
  isDisabled?: boolean
}

export function InnerButton({ children, isDisabled, ...rest }: Props) {
  return (
    <div
      data-disabled={isDisabled}
      className="hover-acrylic !border-none !bg-transparent flex-[1_0_75px] md:flex-1 h-[75px] cursor-pointer data-[disabled=true]:cursor-not-allowed transition-all duration-300 select-none"
      // _active={
      //   isDisabled
      //     ? undefined
      //     : {
      //         opacity: '0.6',
      //       }
      // }
      {...rest}
    >
      {children}
    </div>
  )
}
