import { GiBrokenArrow } from 'react-icons/gi'

export function NotFoundTemplate() {
  return (
    <div className="center flex-col h-full">
      <GiBrokenArrow size="48px" />
      <p className="text-lg">Not found</p>
    </div>
  )
}
