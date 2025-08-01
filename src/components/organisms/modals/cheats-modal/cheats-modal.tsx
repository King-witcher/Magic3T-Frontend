import { useDialogStore } from '@/contexts/modal.store'
import { runCommand } from '@/lib/commands'
import buttonStyles from '@/styles/components/button.module.sass'
import inputStyles from '@/styles/components/input.module.sass'
import { type FormEvent, useCallback, useState } from 'react'

export function CheatsModal() {
  const [input, setInput] = useState('')
  const closeModal = useDialogStore((state) => state.closeModal)

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      runCommand(input)
      setInput('')
      closeModal()
    },
    [input]
  )

  return (
    <form onSubmit={handleSubmit} className="p-[30px] w-[448px] max-w-full">
      <div>
        <h2 className="!text-2xl !font-bold">Insert a cheat</h2>
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
          }}
          className={`acrylic ${inputStyles.text_field} w-full !my-[20px] uppercase`}
          maxLength={16}
          placeholder="Cheat"
        />
      </div>
      <div className="flex items-center justify-end gap-[10px]">
        <button
          className={buttonStyles.primary}
          onClick={handleSubmit}
          type="button"
        >
          Use
        </button>
      </div>
    </form>
  )
}
