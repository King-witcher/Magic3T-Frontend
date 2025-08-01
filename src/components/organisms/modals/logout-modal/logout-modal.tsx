import { useAuth } from '@/contexts/auth.context.tsx'
import { useDialogStore } from '@/contexts/modal.store'
import buttonStyles from '@/styles/components/button.module.sass'

export function LogoutModal() {
  const { signOut } = useAuth()
  const closeModal = useDialogStore((state) => state.closeModal)

  function handleSignOut() {
    closeModal()
    signOut()
  }

  return (
    <div className="p-[20px] w-[448px] max-w-full">
      <div className="p-[10px]">
        <h2 className="text-3xl font-bold font-serif text-gold-4">Log out</h2>
        <p className="my-6">You are about to log out from your account.</p>
      </div>
      <div className="flex items-center justify-end gap-[10px]">
        <button
          className={buttonStyles.secondary}
          onClick={closeModal}
          type="button"
        >
          Cancel
        </button>
        <button
          className={buttonStyles.danger}
          onClick={handleSignOut}
          type="button"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
