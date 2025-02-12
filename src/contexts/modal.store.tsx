import { ReactNode } from 'react'
import { create } from 'zustand'

interface OpenModalProps {
  closeOnOutsideClick?: boolean
}

interface ModalStore {
  content: ReactNode
  isOpen: boolean
  closeOnOutsideClick: boolean
  openModal: (modal: ReactNode, props?: OpenModalProps) => void
  closeModal: () => void
}

export const useModalStore = create<ModalStore>((set) => ({
  content: null,
  isOpen: false,
  closeOnOutsideClick: false,
  openModal: (modal, props) =>
    set(() => ({
      closeOnOutsideClick: props?.closeOnOutsideClick ?? false,
      content: modal,
      isOpen: true,
    })),
  closeModal: () => set(() => ({ isOpen: false })),
}))
