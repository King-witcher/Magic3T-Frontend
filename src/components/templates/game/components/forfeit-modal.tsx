import { useGame } from '@/contexts/game.context.tsx'

interface Props {
  onClose: () => void
}

export function ForfeitModal(props: Props) {
  const { forfeit } = useGame()

  return (
    <div className="px-6 py-4 flex flex-col gap-4 w-100">
      <h2 className="text-3xl font-semibold text-gold-4 font-serif">
        SURRENDER
      </h2>
      <p className="text-gold-1">You are about to surrender.</p>
      <div className="flex gap-2 justify-end mt-2">
        <button
          type="button"
          className="text-gold-1 hover-acrylic px-4 py-2"
          onClick={props.onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-4 py-2 text-red-100 border-1 border-red-500 rounded-lg bg-[#ff000040] hover:bg-[#ff000080] transition-all cursor-pointer"
          onClick={async () => {
            forfeit()
            props.onClose()
          }}
        >
          Surrender
        </button>
      </div>
    </div>
  )
}
