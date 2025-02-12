import { acrylicClasses } from '@/styles/tailwind'
import { Link } from '@tanstack/react-router'
import { FaPlay, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'
import { BiSolidInvader } from 'react-icons/bi'
import { useRef } from 'react'
import { useOutsideClick } from '@/hooks'
import { UserAvatar } from '@/components/molecules'
import { AuthState, useAuth } from '@/contexts/auth.context'
import { divisionMap, leaguesMap } from '@/utils/ranks'
import { MenuOption } from './menu-option'
import { useModalStore } from '@/contexts/modal.store'
import { CheatsModal, LogoutModal } from '../../modals'
import { FaRankingStar } from 'react-icons/fa6'
import { IoBag } from 'react-icons/io5'

interface NavbarMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function NavbarMenu({ isOpen, onClose }: NavbarMenuProps) {
  const ref = useRef<HTMLDivElement>(null)
  const auth = useAuth()
  const league = auth.user && leaguesMap[auth.user.rating.league]

  const openModal = useModalStore((state) => state.openModal)

  function openLogoutModal() {
    onClose()
    openModal(<LogoutModal />, {
      closeOnOutsideClick: true,
    })
  }

  function openCheatsModal() {
    onClose()
    openModal(<CheatsModal />, {
      closeOnOutsideClick: true,
    })
  }

  useOutsideClick(ref, onClose)

  return (
    <div
      tabIndex={-1}
      ref={ref}
      className={`absolute bottom-[10px] right-0 translate-y-full duration-150 ${isOpen ? 'opacity-100' : 'opacity-0 transform-[translateY(-20px)] pointer-events-none'} !p-[10px] bg-[#ffffff30] text-white ${acrylicClasses}  text-black rounded-[10px] w-[330px] backdrop-blur-sm`}
    >
      {auth.authState === AuthState.SignedIn && (
        <>
          <Link
            to="/me"
            onClick={onClose}
            className="flex items-center hover:shadow-[0_0_2px_2px_#ffffff20] rounded-[8px] hover:!bg-[#ffffff20] duration-150"
          >
            <div
              id="avatar-container"
              className="w-[120px] h-[100px] flex items-center justify-center"
            >
              <UserAvatar
                icon={auth.user.summonerIcon}
                league={auth.user.rating.league}
                size={60}
              />
            </div>
            <div className="flex flex-col gap-[5px] ml-[16px]">
              <span className="font-bold text-xl">{auth.user.nickname}</span>
              <div className="flex items-center gap-1">
                <img className="size-6" src={league?.icon} alt={league?.name} />
                <span className="text-sm text-[#ffffffc0] capitalize">
                  {league?.name} {divisionMap[auth.user.rating.division || 0]} -{' '}
                  {auth.user.rating.points}LP
                </span>
              </div>
            </div>
          </Link>
          <hr className="!my-2 !border-[#ffffff60]" />
        </>
      )}
      <div>
        {auth.authState === AuthState.SignedIn && (
          <>
            <Link to="/" onClick={onClose}>
              <MenuOption>
                <FaPlay />
                Play
              </MenuOption>
            </Link>
            <MenuOption className="opacity-50 cursor-default xs:hidden">
              <IoBag /> Store
            </MenuOption>
            <Link to="/ranking" onClick={onClose}>
              <MenuOption className="xs:hidden">
                <FaRankingStar /> Top players
              </MenuOption>
            </Link>
            <MenuOption tabIndex={0} onClick={openCheatsModal}>
              <BiSolidInvader /> Cheats
            </MenuOption>
            <hr className="!my-2 !border-[#ffffff60]" />
            <MenuOption tabIndex={0} onClick={openLogoutModal} danger>
              <FaSignOutAlt />
              Sign out
            </MenuOption>
          </>
        )}
        {auth.authState === AuthState.NotSignedIn && (
          <>
            <MenuOption>
              <FaSignInAlt /> Sign in
            </MenuOption>
          </>
        )}
        {/* <LogoutModal
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
        />
        <SecretCodeModal
          isOpen={cheatsModalOpen}
          onClose={() => setCheatsModalOpen(false)}
        /> */}
      </div>
    </div>
  )
}
