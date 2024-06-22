import {
  Avatar,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import LogoutModal from '@/components/modals/LogoutModal'
import { useAuth } from '@/contexts/auth.context.tsx'
import SecretCodeModal from '@/components/modals/SecretCodeModal'
import { useMemo } from 'react'
import { useRankInfo } from '@/hooks/useRanks'

export function ProfileButton() {
  const navigate = useNavigate()
  const { user, signInGoogle: signIn } = useAuth()

  const { getRankInfo } = useRankInfo()
  const rinfo = useMemo(() => {
    return user && getRankInfo(user.glicko)
  }, [user])

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
      <Tooltip label={user?.nickname} openDelay={400}>
        <MenuButton
          borderRadius="8px"
          transition="all linear 80ms"
          borderColor={rinfo?.colorScheme.darker}
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
            src={user?.photoURL || undefined}
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
      </Tooltip>
      <MenuList>
        {user && (
          <MenuItem as={Link} to="/me">
            Perfil
          </MenuItem>
        )}
        {user && <MenuItem onClick={() => navigate('/')}>Jogar</MenuItem>}
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
