import LogoutModal from '@/components/organisms/modals/LogoutModal'
import SecretCodeModal from '@/components/organisms/modals/SecretCodeModal'
import { useAuth } from '@/contexts/auth.context.tsx'
import { useRankInfo } from '@/hooks/useRanks'
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
import { useMemo } from 'react'

export function ProfileButton() {
  const navigate = useNavigate()
  const { user, signInGoogle: signIn } = useAuth()

  const { getRankInfo } = useRankInfo()
  const rinfo = useMemo(() => {
    return user && getRankInfo(user.glicko)
  }, [user, getRankInfo])

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
        borderRadius="8px"
        transition="all linear 80ms"
        sx={{
          img: {
            transition: 'all linear 80ms',
          },
          _hover: {
            backdropFilter: 'brightness(1.15)',
            img: {
              filter: 'brightness(1.1)',
            },
          },
        }}
      >
        <Avatar
          // src={user?.photoURL || undefined}
          src={getIconUrl(user?.summoner_icon)}
          w="40px"
          h="40px"
          bg="whiteAlpha.300"
          rounded="8px"
          sx={{
            '& img': {
              rounded: '8px',
            },
          }}
        />
      </MenuButton>
      <MenuList zIndex={1}>
        {user && (
          <MenuItem as={Link} to="/me" zIndex={1}>
            Perfil
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
            Jogar
          </MenuItem>
        )}
        {user && <MenuItem onClick={openSecretCode}>Códigos secretos</MenuItem>}
        <MenuItem as={Link} to="/tutorial">
          Como jogar
        </MenuItem>
        <MenuItem as={Link} to="/rating-system">
          Sistema de Ranking
        </MenuItem>
        <MenuDivider color="blue.100" />
        {user && <MenuItem onClick={openLogout}>Sair</MenuItem>}
        {!user && <MenuItem onClick={signIn}>Entrar</MenuItem>}
        <LogoutModal isOpen={logoutModalOpen} onClose={closeLogout} />
        <SecretCodeModal
          isOpen={secretCodeModalOpen}
          onClose={closeSecretCode}
        />
      </MenuList>
    </Menu>
  )
}
