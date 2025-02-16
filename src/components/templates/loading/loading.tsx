import { Spinner } from '@/components/atoms'

export function Loading() {
  return (
    <div className="center h-full w-full">
      <Spinner className="size-[70px]" />
    </div>
  )
}
