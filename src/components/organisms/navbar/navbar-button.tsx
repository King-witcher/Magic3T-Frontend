import { Link, ReactNode } from '@tanstack/react-router'

interface Props {
  href: string
  className?: string
  children: ReactNode
}

export function NavbarButton({ children, href, className }: Props) {
  return (
    <Link
      to={href}
      type="button"
      className={`flex items-center hover:!bg-[#ffffff20] w-fit duration-200 !h-full gap-[10px] !px-[10px] ${className}`}
    >
      {children}
    </Link>
  )
}
