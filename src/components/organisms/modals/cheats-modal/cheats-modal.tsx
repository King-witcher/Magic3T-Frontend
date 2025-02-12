import { useModalStore } from '@/contexts/modal.store'
import { runCommand } from '@/lib/Commands'
import { type FormEvent, useCallback, useState } from 'react'
import buttonStyles from '@/styles/components/button.module.sass'

export function CheatsModal() {
  const [input, setInput] = useState('')
  const closeModal = useModalStore((state) => state.closeModal)

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
    <div className="p-[20px] w-[448px]">
      <div className="p-[10px]">
        <h2 className="!text-2xl !font-bold">Insert a cheat</h2>
        <form onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
            }}
            className="acrylic !h-[35px] w-full text-center !my-[20px] uppercase placeholder:!text-[#ffffff80]"
            maxLength={16}
            placeholder="Cheat"
          />
        </form>
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
    </div>
  )
}
