import LogoutModal from '@/components/organisms/modals/LogoutModal'
import SecretCodeModal from '@/components/organisms/modals/SecretCodeModal'
import { useAuth } from '@/contexts/auth.context.tsx'
import { getIconUrl } from '@/utils/utils'
import {
  Avatar,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react'
import { Link, useNavigate } from '@tanstack/react-router'

export function ProfileButton() {
  const navigate = useNavigate()
  const { user, signInGoogle: signIn } = useAuth()

  const {
    isOpen: logoutModalOpen,
    onOpen: openLogout,
    onClose: closeLogout,
  } = useDisclosure()
  const {
    isOpen: secretCodeModalOpen,
    onOpen: openSecretCode,
    onClose: closeSecretCode,
  } = useDisclosure()

  return (
    <Menu>
      <MenuButton
        borderRadius="9999"
        transition="all linear 200ms"
        sx={{
          img: {
            transition: 'all linear 80ms',
          },
          _hover: {
            img: {
              filter: 'brightness(1.1) saturate(1.1)',
            },
          },
        }}
      >
        <Avatar
          // src={user?.photoURL || undefined}
          src={getIconUrl(user?.summoner_icon)}
          border="2px solid #ffffff40"
          w="40px"
          h="40px"
          bg="whiteAlpha.300"
          rounded="9999"
          sx={{
            '& img': {
              rounded: '9999',
            },
          }}
        />
      </MenuButton>
      <MenuList zIndex={1}>
        {user && (
          <MenuItem as={Link} to="/me" zIndex={1}>
            Profile
          </MenuItem>
        )}
        {user && (
          <MenuItem
            onClick={() =>
              navigate({
                to: '/',
              })
            }
          >
            Play
          </MenuItem>
        )}
        {user && <MenuItem onClick={openSecretCode}>Cheats</MenuItem>}
        <MenuItem as={Link} to="/tutorial">
          How to play
        </MenuItem>
        <MenuItem as={Link} to="/rating-system">
          Rating system
        </MenuItem>
        <MenuItem as={Link} to="/ranking">
          Top players
        </MenuItem>
        <MenuDivider color="blue.100" />
        {user && <MenuItem onClick={openLogout}>Sign out</MenuItem>}
        {!user && <MenuItem onClick={signIn}>Sign in</MenuItem>}
        <LogoutModal isOpen={logoutModalOpen} onClose={closeLogout} />
        <SecretCodeModal
          isOpen={secretCodeModalOpen}
          onClose={closeSecretCode}
        />
      </MenuList>
    </Menu>
  )
}
