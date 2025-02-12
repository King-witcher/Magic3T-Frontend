import { useModalStore } from '@/contexts/modal.store'
import { useOutsideClick } from '@/hooks'
import { useRef } from 'react'

export function ModalLayout() {
  const content = useModalStore((state) => state.content)
  const isOpen = useModalStore((state) => state.isOpen)
  const closeModal = useModalStore((state) => state.closeModal)

  const modalRef = useRef<HTMLDivElement>(null)
  useOutsideClick(modalRef, closeModal)

  return (
    <>
      <div
        className={`fixed inset-0 flex items-center justify-center z-10 transition-all !duration-800
          ${
            isOpen
              ? 'bg-[#00000080] backdrop-blur-[1px]'
              : 'bg-transparent to-[#00000000] pointer-events-none'
          }`}
      />
      <div
        className={`fixed inset-0 flex items-center justify-center z-10 p-[20px] 
          ${isOpen ? '' : 'pointer-events-none'}`}
      >
        <section
          ref={modalRef}
          className={`acrylic translucent heavy-shadow relative duration-150 max-w-full
          ${isOpen ? '' : 'pointer-events-none opacity-0 scale-95'}`}
        >
          {content}
        </section>
      </div>
    </>
  )
}
