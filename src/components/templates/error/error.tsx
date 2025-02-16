import { Link } from '@tanstack/react-router'
import { MdDangerous } from 'react-icons/md'

export function ErrorTemplate() {
  return (
    <div className="center flex-col bg-blue-5 bg-im text-gold-1 h-dvh">
      <MdDangerous color="#ff4060" size="200px" />
      <p className="text-xl text-center font-sans">
        A runtime error prevented Magic3T from displaying this page.
      </p>
      <Link
        to="/"
        className="text-xl font-sans font-bold !text-gold-4 underline"
      >
        Go back to home page
      </Link>
    </div>
  )
}
