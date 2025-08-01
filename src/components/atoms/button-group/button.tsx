import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export function Button(props: ComponentProps<'button'>) {
  const { children, className, ...rest } = props

  return (
    <button
      type="button"
      className={twMerge(
        'px-4 py-4 bg-[#ffffff20] flex-1 hover:bg-[#ffffff40] active:bg-[#ffffff60] transition-background duration-200',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
