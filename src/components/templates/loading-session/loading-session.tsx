import { Spinner } from '@/components/atoms'

export function LoadingSessionTemplate() {
  return (
    <div className="center h-full flex-col">
      <Spinner className="size-[50px]" />
      <span className="text-lg text-gold-1 font-bold mt-3">
        Loading session
      </span>
      <p className="text-sm text-grey-1 text-center">
        If nothing shows up shortly, refresh the page.
      </p>
    </div>
  )
}
