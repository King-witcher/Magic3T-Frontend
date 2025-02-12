import { AuthState, useAuth } from '@/contexts/auth.context.tsx'
import { getIconUrl } from '@/utils/utils'
import { Link } from '@tanstack/react-router'
import { useCallback, useState } from 'react'
import { FaRankingStar } from 'react-icons/fa6'
import { IoBag } from 'react-icons/io5'
import { NavbarMenu } from './menu/navbar-menu'
import { NavbarButton } from './navbar-button'

export function Navbar() {
  const { authState, user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleClickOutsideMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <nav className="w-full h-[65px] flex gap-[10px] px-[10px] !border-b-1 !border-b-[#ffffff80] items-center justify-between flex-[0_0_65px] bg-clip-padding text-white z-1 shadow-[0_0_12px_0_#00000040] bg-[linear-gradient(90deg,_#ffffff30,_#ffffff40,_#ffffff30)]">
      <div className="flex items-center gap-[5px]">
        <Link
          className="flex p-[10px] rounded-[10px] select-none cursor-pointer gap-[3px] hover:!bg-[#ffffff20] duration-200"
          to="/"
        >
          <span className="font-medium">Play</span>
          <span className="font-bold">Magic3T</span>
        </Link>
        {/* {Object.entries(activities).map(([key, activity]) => (
          <ActivityBadge key={key} liveActivity={activity} />
        ))} */}
      </div>
      <div className="flex items-center h-full">
        {authState === AuthState.SignedIn && (
          <NavbarButton className="hidden xs:flex opacity-50" href="/ranking">
            <IoBag /> Store
          </NavbarButton>
        )}
        <NavbarButton href="/ranking" className="hidden xs:flex">
          <FaRankingStar /> Top players
        </NavbarButton>
        <div id="profile-button-container" className="relative h-full">
          <button
            type="button"
            className="flex items-center justify-center hover:!bg-[#ffffff20] duration-200 aspect-square h-full gap-[10px] !px-[10px]"
            onClick={() => setIsOpen(true)}
          >
            <div
              id="profile-icon-container"
              className="rounded-[999px] !border-2 !border-[#ffffff80] bg-[#00000020] size-[40px] overflow-hidden"
            >
              {authState === AuthState.Loading && (
                <div className="animate-pulse ease duration-1000 bg-[#ffffffa0] w-full h-full" />
              )}
              {authState === AuthState.SignedIn && (
                <img alt="" src={getIconUrl(user.summonerIcon)} />
              )}
            </div>
            {/* <span className="font-bold">{user?.nickname}</span> */}
          </button>
          <NavbarMenu isOpen={isOpen} onClose={handleClickOutsideMenu} />
        </div>
      </div>
    </nav>
  )
}
