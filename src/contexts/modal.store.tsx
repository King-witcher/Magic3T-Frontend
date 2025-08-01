import { ReactNode } from 'react'
import { create } from 'zustand'

interface OpenModalProps {
  closeOnOutsideClick?: boolean
}

interface ModalStore {
  content: ReactNode
  isOpen: boolean
  closeOnOutsideClick: boolean
  showDialog: (modal: ReactNode, props?: OpenModalProps) => void
  closeModal: () => void
}

export const useDialogStore = create<ModalStore>((set) => ({
  content: null,
  isOpen: false,
  closeOnOutsideClick: false,
  showDialog: (dialog, props) =>
    set(() => ({
      closeOnOutsideClick: props?.closeOnOutsideClick ?? false,
      content: dialog,
      isOpen: true,
    })),
  closeModal: () => set(() => ({ isOpen: false })),
}))
