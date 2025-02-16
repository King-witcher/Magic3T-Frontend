import type { ReactNode } from '@tanstack/react-router'

interface Props {
  children: ReactNode
}

export function PageWidthLimiter({ children }: Props) {
  return (
    <div className="flex p-[30px] sm:p-[40px_100px] w-full justify-center">
      <div className="w-full max-w-[1400px]">{children}</div>
    </div>
  )
}
