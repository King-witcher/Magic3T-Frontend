import { AuthState, useAuth } from '@/contexts/auth.context.tsx'
import { useLiveActivity } from '@/contexts/live-activity.context.tsx'
import { Skeleton } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { ActivityBadge } from './activity-badge'
import { ProfileButton } from './profile-button'

export function Navbar() {
  const { activities } = useLiveActivity()
  const { authState } = useAuth()

  return (
    <nav className="w-full h-[65px] flex gap-[10px] px-[10px] !border-b-1 !border-b-[#ffffff80] items-center justify-between flex-[0_0_65px] backdrop-blur-[10px] bg-clip-padding text-white z-1 shadow-[0_0_12px_0_#00000040] bg-[linear-gradient(90deg,_#ffffff30,_#ffffff40,_#ffffff30)]">
      <div className="flex items-center gap-[5px]">
        <Link
          className="flex p-[10px] rounded-[10px] select-none cursor-pointer gap-[3px] hover:!bg-[#ffffff20] duration-200"
          as={Link}
          to="/"
        >
          <span className="font-medium">Play</span>
          <span className="font-bold">Magic3T</span>
        </Link>
        {Object.entries(activities).map(([key, activity]) => (
          <ActivityBadge key={key} liveActivity={activity} />
        ))}
      </div>
      <Skeleton isLoaded={authState !== AuthState.Loading} borderRadius="999px">
        <ProfileButton />
      </Skeleton>
    </nav>
  )
}
