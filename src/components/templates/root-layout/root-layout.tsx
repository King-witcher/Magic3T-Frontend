import { PageWidthLimiter } from '@/components/atoms'
import { Navbar } from '@/components/organisms'
import type { ReactNode } from 'react'
import { ModalLayout } from './modal-layout'
import styles from './styles.module.sass'

interface Props {
  children: ReactNode
}

export function RootLayout({ children }: Props) {
  return (
    <>
      <div className={styles.brightness_container} />
      <div className="root-layout flex flex-col items-center h-dvh relative">
        <Navbar />
        <div className="flex flex-[1] w-full justify-center h-fit overflow-x-hidden overflow-y-scroll">
          <PageWidthLimiter>{children}</PageWidthLimiter>
        </div>
      </div>
      <ModalLayout />
    </>
  )
}
